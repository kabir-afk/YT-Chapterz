import { runtime } from 'webextension-polyfill'

runtime.onInstalled.addListener(() => {
  console.log('service_worker loaded ')
})

export {}