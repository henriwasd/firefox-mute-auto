let lastTabWithAudio = null

// Função para enviar uma mensagem ao background script para silenciar outras abas
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
        } else if (tab.audible) {
          browser.tabs.update(tab.id, { muted: true })
        }
      })

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

// Listener para atualizações de abas
browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
  try {
    if (changeInfo.audible !== undefined) {
      muteOtherTabs(tabId)
    }
  } catch (error) {
    console.error('Error handling tab update:', error)
  }
})

// Listener para mudanças de aba ativa
browser.tabs.onActivated.addListener((activeInfo) => {
  try {
    muteOtherTabs(activeInfo.tabId)
  } catch (error) {
    console.error('Error handling tab activation:', error)
  }
})

// Listener para mudanças de visibilidade da página
function setupPageVisibilityChangeListener() {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        if (tabs.length > 0) {
          muteOtherTabs(tabs[0].id)
        }
      })
    }
  })
}

// Configura o listener de mudança de visibilidade da página
setupPageVisibilityChangeListener()

// Silencia outras abas se a página estiver visível no momento do carregamento
if (document.visibilityState === 'visible') {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    if (tabs.length > 0) {
      muteOtherTabs(tabs[0].id)
    }
  })
}