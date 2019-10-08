/* eslint-disable @typescript-eslint/no-var-requires */
import * as functions from 'firebase-functions'
import * as googleapis from 'googleapis'
import * as dayjs from 'dayjs'
import admin from './admin'
import { Firestore } from '@google-cloud/firestore'
const fireStore: Firestore = admin.firestore()

interface PageView {
  pageId: string
  pv: number
}

function getAnaliticsResource(): Record<string, any> {
  const viewId = functions.config().hubb.ga_view_id //GoogleAnalyticsのビューidを指定
  const today = dayjs()
  const startDate = today.subtract(7, 'day').format('YYYY-MM-DD') // 7日前
  const endDate = today.format('YYYY-MM-DD') // 今日
  return {
    reportRequests: [
      {
        dateRanges: [
          {
            startDate: startDate,
            endDate: endDate
          }
        ],
        viewId: viewId,
        dimensions: [
          {
            name: 'ga:pagePath'
          }
        ],
        metrics: [
          {
            expression: 'ga:pageviews'
          }
        ],
        orderBys: [
          {
            fieldName: 'ga:pageviews',
            sortOrder: 'DESCENDING'
          }
        ]
      }
    ]
  }
}

export const getAnalytics = functions
  .region('asia-northeast1')
  .pubsub.schedule('every 1 hours')
  .onRun(
    async (): Promise<any> => {
      const serviceAccount = require('./serviceAccountKey.json')
      const google = new googleapis.GoogleApis()
      const analytics = google.analyticsreporting('v4')

      const jwtClient = new google.auth.JWT(
        serviceAccount.client_email,
        '',
        serviceAccount.private_key,
        ['https://www.googleapis.com/auth/analytics.readonly'],
        ''
      )

      jwtClient.authorize((error): void => {
        if (error) {
          console.log(error)
          return
        }
        analytics.reports.batchGet(
          {
            resource: getAnaliticsResource(),
            auth: jwtClient
          } as any,
          async (error, response): Promise<any> => {
            if (error) {
              console.log(error)
            }
            const pageViews: PageView[] = response.data.reports[0].data.rows
              .filter((row): boolean => {
                return row.dimensions[0].startsWith('/pages')
              })
              .map(
                (row): PageView => {
                  return {
                    pageId: row.dimensions[0].replace('/pages/', ''),
                    pv: Number(row.metrics[0].values[0])
                  }
                }
              )

            for (const pageView of pageViews) {
              await fireStore
                .collection('pv')
                .doc(pageView.pageId)
                .set({ pv: pageView.pv, updatedAt: new Date() })
            }
            return null
          }
        )
      })
    }
  )
