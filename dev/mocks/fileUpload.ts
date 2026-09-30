import BaseAPI from "@/api/base"
import { HttpError, type ReqPayload, type TrailsResp } from "@/api/client"
import type { UploadedFile } from "@/composables/forms"

// NOTE(spk): this file is used to mock the file upload component
// by overloading BaseAPI.post - which is used internally by FileUpload.vue
//
// Use the sample files in ./sample-files to see state handling in the UI.

export const fileUploadMockAction = "docs-file-upload"

const failedFiles = new WeakSet<File>()
let nextID = 1000

const wait = (milliseconds: number) => {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds))
}

const upload = async (data?: ReqPayload): Promise<TrailsResp<UploadedFile>> => {
  const file = data instanceof FormData ? data.get("file") : undefined

  await wait(1000)

  if (!(file instanceof File)) {
    throw new HttpError("No file was sent to the upload mock.", 400)
  }

  // Fail once when the filename includes "error" so retry can take the
  // success path without asking someone to choose another file.
  if (file.name.toLowerCase().includes("error") && !failedFiles.has(file)) {
    failedFiles.add(file)
    throw new HttpError("The upload mock failed this file.", 500)
  }

  nextID += 1
  return {
    data: {
      id: nextID,
      name: file.name,
    },
  }
}

const originalPost = BaseAPI.post
// Keep the made-up action specific to this demo so every other docs request
// continues through BaseAPI as usual.
const mockPost = ((...args: Parameters<typeof BaseAPI.post>) => {
  const [path, data] = args

  if (path !== fileUploadMockAction) {
    return originalPost(...args)
  }

  return upload(data)
}) as typeof BaseAPI.post

BaseAPI.post = mockPost

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (BaseAPI.post === mockPost) {
      BaseAPI.post = originalPost
    }
  })
}
