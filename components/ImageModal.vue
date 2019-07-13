<template>
  <div v-if="show" class="modal">
    <div class="modal-content">
      <h1>画像アップロード</h1>
      <header class="tab-header">
        <button class="active">
          ファイルを選択してください
        </button>
      </header>
      <div>
        <vue-dropzone
          id="dropzone"
          ref="myVueDropzone"
          :options="dropzoneOptions"
          @vdropzone-success="vfileUploaded"
        />
      </div>

      <footer class="modal-footer">
        <button
          class="success"
          :title="validImage ? '' : 'Image URL needs to be valid'"
          :disabled="!validImage"
          @click="insertImage"
        >
          アップロード
        </button>
        <button class="danger" @click="show = false">閉じる</button>
      </footer>
    </div>
  </div>
</template>

<script>
import Dropzone from 'nuxt-dropzone'
import 'nuxt-dropzone/dropzone.css'
import { storage } from '~/plugins/firebase'

export default {
  components: {
    vueDropzone: Dropzone
  },
  data() {
    return {
      imageSrc: '',
      command: null,
      show: false,
      tab: 0,
      dropzoneOptions: {
        url: 'https://httpbin.org/post',
        thumbnailWidth: 200,
        dictDefaultMessage: 'アップロードするファイルをドロップ',
        addRemoveLinks: true
      }
    }
  },
  computed: {
    validImage() {
      return !!this.imageSrc
    },
    user() {
      return this.$store.state.user.user
    }
  },
  methods: {
    showModal(command) {
      // Add the sent command
      this.command = command
      this.show = true
    },
    vfileUploaded(file) {
      const storageRef = storage.ref()
      const imagesRef = storageRef.child(
        `user/${this.user.uid}/page/${this.$route.params.id}/${file.upload.uuid}`
      )
      imagesRef
        .put(file)
        .then(snapshot => {
          snapshot.ref.getDownloadURL().then(downloadURL => {
            this.imageSrc = downloadURL
          })
        })
        .catch(e => {
          if (e.code_ === 'storage/unauthorized') {
            window.alert('画像サイズオーバーです。')
          }
        })
    },
    insertImage() {
      const data = {
        command: this.command,
        data: {
          src: this.imageSrc,
          alt: 'image',
          title: 'title'
        }
      }

      this.$emit('onConfirm', data)
      this.closeModal()
    },

    closeModal() {
      this.show = false
      this.imageSrc = ''
    }
  }
}
</script>

<style scoped>
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  width: 90%;
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
}

.modal-footer {
  margin-top: 10px;
}

label {
  display: block;
  margin: 0.25em 0;
}

button {
  font-family: inherit;
  font-size: 100%;
  padding: 0.5em 1em;
  color: white;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  border: 1px solid #999;
  border: transparent;
  background-color: #e6e6e6;
  text-decoration: none;
  border-radius: 2px;
  cursor: pointer;
}

button.danger {
  background: rgb(202, 60, 60);
}

button.success {
  background: rgb(28, 184, 65);
}

button:disabled {
  opacity: 0.3;
}

button + button {
  margin-left: 10px;
}

.tab-header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #222;
}

.tab-header button {
  color: #222;
  background: none;
  border: 0;
  flex: 1;
  padding: 5px 10px;
  cursor: pointer;
}

.tab-header button.active {
  background-color: #222;
  color: #fff;
}
</style>
