import { ref, Ref } from "vue"

export interface SpinnerControl {
  show: (msgs?: string[]) => void
  hide: () => void
}

export interface UseSpinnerDisplay extends SpinnerControl {
  idx: Ref<number>
  loading: Ref<boolean>
  maxIdx: Ref<number>
  messages: Ref<string[]>
  msg: Ref<string>
  showMsg: Ref<boolean>
}

export function useSpinnerDisplay() {
  const idx = ref(0)
  const loading = ref(false)
  const maxIdx = ref(0)
  const messages = ref<string[]>([])
  const msg = ref("")
  const showMsg = ref(false)

  const show = (spinMessages: string[] = []) => {
    if (spinMessages) {
      messages.value = spinMessages
      maxIdx.value = spinMessages.length - 1
      msg.value = messages.value[idx.value]
      showMsg.value = true
    }
    loading.value = true
  }

  const hide = () => {
    idx.value = 0
    maxIdx.value = 0
    messages.value = []
    msg.value = ""
    loading.value = false
  }

  return {
    idx,
    loading,
    maxIdx,
    messages,
    msg,
    showMsg,
    show,
    hide,
  }
}

let appSpinner: UseSpinnerDisplay | undefined = undefined
export function useAppSpinnerDisplay() {
  if (appSpinner === undefined) {
    appSpinner = useSpinnerDisplay()
  }
  return appSpinner
}

export default function useAppSpinner() {
  const { show, hide } = useAppSpinnerDisplay()
  return {
    show,
    hide,
  }
}
