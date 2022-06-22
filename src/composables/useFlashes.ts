import { Ref, ref } from "vue"
import Uniques from "@/helpers/Uniques"

/**
 * FlashMessage represents the shape of an on screen notification
 * to a user.
 */
export interface FlashMessage {
  /**
   * The primary body text of the flash.  It supports HTML.
   */
  message: string
  /**
   * Allow the flash to stay on the screen until the user removes it.
   */
  persistent?: boolean
  /**
   * Determines the style of the flash.
   */
  type: FlashType
}

/**
 * FlashType is used to set the style of the flash that is displayed.
 */
export type FlashType = "warning" | "error" | "info" | "success"

/**
 * A storage type for flash management.
 */
export type FlashStore = Map<string, FlashMessage>

/**
 * A Flasher instance config.
 */
export interface FlasherConfig {
  removeDelay?: number
  email?: string
}

/**
 * The FlasherAPI offers a simple set of methods for adding and removing flash messages.
 * The implementor of the FlasherAPI is responsible for determining where flashes are stored.
 */
export interface Flasher {
  add(flash: FlashMessage): string
  remove(id: string): void
  flash(flash: FlashMessage): string
  error(msg: string, persistent?: boolean): string
  info(msg: string, persistent?: boolean): string
  success(msg: string, persistent?: boolean): string
  warning(msg: string, persistent?: boolean): string
  genericError(email?: string, persistent?: boolean): string
}

export interface UseFlashes {
  flasher: Flasher
  flashes: Ref<FlashStore>
  configure(config: FlasherConfig): void
}

/**
 * useFlashes exposes the module level global flashes and flasher for shared access to
 * the a flash queue when a flashStore isn't provided
 * @returns UseFlashes
 */
export function useFlashes(flasherConfig: FlasherConfig = {}) {
  const flashes: Ref<FlashStore> = ref<Map<string, FlashMessage>>(new Map())

  let config = {
    removeDelay: 10000,
    email: "",
  }

  const configure = (newConfig: FlasherConfig) => {
    config = {
      ...config,
      ...newConfig,
    }
  }

  const remove = (id: string) => {
    flashes.value.delete(id)
  }

  const add = (flash: FlashMessage) => {
    const ID = Uniques.CreateIdAttribute()
    flashes.value.set(ID, flash)

    if (flash.persistent === undefined || !flash.persistent) {
      setTimeout(() => remove(ID), config.removeDelay)
    }

    return ID
  }

  const flash = (flash: FlashMessage) => {
    return add(flash)
  }

  const error = (message: string, persistent = false) => {
    return add({ message, persistent, type: "error" })
  }

  const info = (message: string, persistent = false) => {
    return add({
      message,
      persistent,
      type: "info",
    })
  }

  const success = (message: string, persistent = false) => {
    return add({
      message,
      persistent,
      type: "success",
    })
  }

  const warning = (message: string, persistent = false) => {
    return add({
      message,
      persistent,
      type: "warning",
    })
  }

  const genericError = (email = "", persistent = false) => {
    const msgEmail = email || config.email
    const message = msgEmail
      ? `Whoops! Something went wrong, please reach out to 
        <a class="underline text-xy-blue" href="mailto:${msgEmail}">${msgEmail}</a> 
        if the issue persists.`
      : `Whoops! Something went wrong.`
    return add({
      message,
      persistent,
      type: "error",
    })
  }

  configure(flasherConfig || {})

  return {
    flasher: {
      add,
      remove,
      flash,
      error,
      warning,
      info,
      success,
      genericError,
    },
    flashes,
    configure,
  }
}

/**
 * A helper method to load any flashes on the global Window.Flashes into the flashes ref.
 * The flasher argument ultimately determines what flashes ref they should be added to.
 * @param flasher FlashAPI
 */
export const loadWindowFlashes = (flasher: Flasher) => {
  if (window.Flashes) {
    for (const flash of window.Flashes) {
      if (typeof flash.type === "undefined") {
        const values: string[] = flash.message.split(": ")
        flasher.add({ type: values[0] as FlashType, message: values[1] })
        continue
      }
      flasher.add(flash as FlashMessage)
    }
  }
}

// simplify application usage by setting up a global store and singleton app flasher
let appFlashes: UseFlashes | undefined = undefined
export function useAppFlashes() {
  if (appFlashes === undefined) {
    appFlashes = useFlashes()
  }

  return appFlashes
}

// most components and pages will only need access to the flasher of the global appFlashes
// this allows for a simple import statement with direct access to the flash methods
// import { useAppFlasher } from "@xy-planning-network/trees"
//
// useAppFlasher().genericError()
export function useAppFlasher() {
  return useAppFlashes().flasher
}
