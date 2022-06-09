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
 * The FlasherAPI offers a simple set of methods for adding and removing flash messages.
 * The implementor of the FlasherAPI is responsible for determining where flashes are stored.
 */
export interface FlasherAPI {
  add(flash: FlashMessage): string
  remove(id: string): void
  error(msg: string, persistent?: boolean): string
  info(msg: string, persistent?: boolean): string
  success(msg: string, persistent?: boolean): string
  warning(msg: string, persistent?: boolean): string
  genericError(email?: string, persistent?: boolean): string
  setConfig(config: FlasherConfig): void
}

/**
 * A storage type for flash management.
 */
type FlashStore = Map<string, FlashMessage>

/**
 *
 */
interface FlasherConfig {
  removeDelay?: number
  email?: string
}

/**
 * newFlasher implements the FlasherAPI interface on the FlashStore it recieves
 * the flash remove delay and a default email address for generic flashes is configurable
 */
export const newFlasher = (
  flashStore: FlashStore,
  flasherConfig?: FlasherConfig
) => {
  let config: FlasherConfig = {
    removeDelay: 10000,
    email: "",
  }

  const setConfig = (newConfig: FlasherConfig) => {
    config = {
      ...config,
      ...newConfig,
    }
  }

  setConfig(flasherConfig || {})

  return {
    add(flash: FlashMessage) {
      const ID = Uniques.CreateIdAttribute()
      flashStore.set(ID, flash)

      if (flash.persistent === undefined || !flash.persistent) {
        setTimeout(() => this.remove(ID), config.removeDelay)
      }

      return ID
    },
    remove(id: string) {
      flashStore.delete(id)
    },
    flash(flash: FlashMessage) {
      return this.add(flash)
    },
    error(message: string, persistent = false) {
      return this.add({ message, persistent, type: "error" })
    },
    info(message: string, persistent = false) {
      return this.add({
        message,
        persistent,
        type: "info",
      })
    },
    success(message: string, persistent = false) {
      return this.add({
        message,
        persistent,
        type: "success",
      })
    },
    warning(message: string, persistent = false) {
      return this.add({
        message,
        persistent,
        type: "warning",
      })
    },
    genericError(email = "", persistent = false) {
      const msgEmail = email || config.email
      const message = msgEmail
        ? `Whoops! Something went wrong, please reach out to 
        <a class="underline text-xy-blue" href="mailto:${msgEmail}">${msgEmail}</a> 
        if the issue persists.`
        : `Whoops! Something went wrong.`
      return this.add({
        message,
        persistent,
        type: "error",
      })
    },
    setConfig,
  }
}

// simplify application usage by setting up a global store and flasher
const globalFlashStore = ref(new Map<string, FlashMessage>())
const globalFlasher = newFlasher(globalFlashStore.value)
const flasher = globalFlasher
export default flasher

/**
 * useFlashes exposes the module level global flashes and flasher for shared access to
 * the a flash queue when a flashStore isn't provided
 * @returns UseFlashes
 */
export function useFlashes(flashStore?: FlashStore) {
  const storeRef = flashStore ? ref(flashStore) : globalFlashStore
  return {
    flasher: flashStore ? newFlasher(storeRef.value) : globalFlasher,
    flashes: storeRef,
  }
}

/**
 * A helper method to load any flashes on the global Window.Flashes into the flashes ref.
 * The flasher argument ultimately determines what flashes ref they should be added to.
 * @param flasher FlashAPI
 */
export const loadWindowFlashes = (flasher: FlasherAPI) => {
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
