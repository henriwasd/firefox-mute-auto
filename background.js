// Função para enviar uma mensagem ao background script para silenciar outras abas
function muteOtherTabs() {
  try {
    browser.runtime.sendMessage({ type: 'mute_other_tabs' }).then((response) => {
      console.log('Mensagem enviada para silenciar outras abas:', response)
    }).catch((error) => {
      console.error('Erro ao enviar mensagem para silenciar outras abas:', error)
    })
  } catch (error) {
    console.error('Erro ao tentar silenciar outras abas:', error)
  }
}

// Função para configurar o listener de mudança de visibilidade da página
function setupPageVisibilityChangeListener() {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      muteOtherTabs()
    }
  })
}

// Configura o listener de mudança de visibilidade da página
setupPageVisibilityChangeListener()

// Silencia outras abas se a página estiver visível no momento do carregamento
if (document.visibilityState === 'visible') {
  muteOtherTabs()
}

let lastTabWithAudio = null

browser.runtime.onMessage.addListener((message, sender) => {
  try {
    if (message.type === 'mute_other_tabs') {
      muteOtherTabs(sender.tab.id)
    }
  } catch (error) {
    console.error('Error handling message:', error)
  }
})

browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
  try {
    if (changeInfo.audible !== undefined) {
      muteOtherTabs(tabId)
    }
  } catch (error) {
    console.error('Error handling tab update:', error)
  }
})

function muteOtherTabs(currentTabId) {
  try {
    browser.tabs.query({}).then((tabs) => {
      let currentTabIsPlayingAudio = false
      let currentTabIsPinned = false

      tabs.forEach((tab) => {
        if (tab.id === currentTabId) {
          currentTabIsPinned = tab.pinned
          if (tab.audible) {
            currentTabIsPlayingAudio = true
            lastTabWithAudio = currentTabId
          }
          browser.tabs.update(tab.id, { muted: false })
        }
      })

      if (!currentTabIsPinned) {
        tabs.forEach((tab) => {
          if (tab.id !== currentTabId && !tab.pinned) {
            browser.tabs.update(tab.id, { muted: true })
          }
        })
      }

      if (!currentTabIsPlayingAudio && lastTabWithAudio !== null && !currentTabIsPinned) {
        browser.tabs.query({ pinned: false }).then((unpinnedTabs) => {
          const lastTab = unpinnedTabs.find(tab => tab.id === lastTabWithAudio)
          if (lastTab) {
            browser.tabs.update(lastTabWithAudio, { muted: false })
          }
        })
      }
    }).catch((error) => {
      console.error('Error querying tabs:', error)
    })
  } catch (error) {
    console.error('Error muting other tabs:', error)
  }
}