<template>
  <div>
    <el-card>
      <div slot="header">
        <div>课程：xxx</div>
        <div>阶段：xxx</div>
        <div>课时：xxx</div>
      </div>
      <el-form label-width="70px">
        <el-form-item label="视频上传">
          <input ref="video-file" type="file" />
        </el-form-item>
        <el-form-item label="封面上传">
          <input ref="image-file" type="file" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleUpload">开始上传</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  getAliyunImagUploadAddressAdnAuth,
  getAliyunVideoUploadAddressAdnAuth,
  aliyunTransCode,
  getAliyunTransCodePercent
} from '@/services/course'

export default Vue.extend({
  name: 'CourseVideo',

  data () {
    return {
      uploader: null,
      imageURL: '',
      videoId: null
    }
  },

  computed: {
    video () {
      return this.$refs['video-file']
    },

    image () {
      return this.$refs['image-file']
    }
  },

  created () {
    this.initUploader()
  },

  methods: {
    initUploader () {
      this.uploader = new window.AliyunUpload.Vod({
        // userID，必填，只需有值即可。
        userId: '1618139964448548',

        // 上传到视频点播的地域，默认值为'cn-shanghai'，//eu-central-1，ap-southeast-1
        region: '',

        // 分片大小默认1 MB，不能小于100 KB
        partSize: 1048576,

        // 并行上传分片个数，默认5
        parallel: 5,

        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,

        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,

        // 开始上传
        onUploadstarted: async (uploadInfo: any) => {
          // 通过我们的后端获取文件上传凭证
          let uploadAddressAndAuth
          if (uploadInfo.isImage) {
            // 获取图片上传凭证
            const { data } = await getAliyunImagUploadAddressAdnAuth()
            uploadAddressAndAuth = data.data
            this.imageURL = data.data.imageURL
          } else {
            // 获取视频上传凭证
            const { data } = await getAliyunVideoUploadAddressAdnAuth({
              fileName: uploadInfo.file.name,
              imageUrl: this.imageURL
            })
            uploadAddressAndAuth = data.data
            this.videoId = uploadAddressAndAuth.videoId
          }

          // 调用 setUploadAuthAndAddress 设置上传凭证
          (this.uploader as any).setUploadAuthAndAddress(
            uploadInfo,
            uploadAddressAndAuth.uploadAuth,
            uploadAddressAndAuth.uploadAddress,
            uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId
          )

          // 设置好上传凭证没有问题，上传进度开始
        },

        // 文件上传成功
        onUploadSucceed: function (uploadInfo: any) {
          //
        },

        // 文件上传失败
        onUploadFailed: function (uploadInfo: any, code: any, message: any) {
          //
        },

        // 文件上传进度，单位：字节
        onUploadProgress: function (
          uploadInfo: any,
          totalSize: any,
          loadedPercent: any
        ) {
          console.log('onUploadProgress', uploadInfo, totalSize, loadedPercent)
        },

        // 上传凭证或STS token超时
        onUploadTokenExpired: function (uploadInfo: any) {
          //
        },

        // 全部文件上传结束
        onUploadEnd: async (uploadInfo: any) => {
          console.log('onUploadEnd', uploadInfo)
          // 请求转码
          const { data } = await aliyunTransCode({
            lessonId: this.$route.query.lessonId,
            coverImageUrl: this.imageURL,
            fileName: (this.video as any).files[0].name,
            fileId: this.videoId
          })

          // 轮询查询转码进度
          const timer = setInterval(async () => {
            const { data } = await getAliyunTransCodePercent(this.$route.query.lessonId)
            console.log('getAliyunTransCodePercent', data.data)
            if (data.data === 100) {
              clearInterval(timer)
            }
          }, 3000)
        }
      })
    },

    handleUpload () {
      // 获取上传的文件
      const videoFile = (this.video as any).files[0]
      const imageFile = (this.image as any).files[0]

      // 将用户所选的文件添加到上传列表中
      const uploader = this.uploader as any
      const paramData = '{"Vod":{}}'
      uploader.addFile(imageFile, null, null, null, paramData)
      uploader.addFile(videoFile, null, null, null, paramData)

      // 开始上传
      uploader.startUpload()
    }
  }
})
</script>

<style lang="scss" scoped></style>
