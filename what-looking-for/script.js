document.addEventListener('DOMContentLoaded', function() {
  const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyCleBK9sFSkxTGRQHbCCRNn1UMM4Zq42dOVhN4Va4NvmYoXqRPhuHjvj5xYkYbiRM/exec';
  
  const tabs = document.querySelectorAll('.category-tab');
  const categoryContents = document.querySelectorAll('.category-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      categoryContents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const categoryId = tab.getAttribute('data-category');
      document.getElementById(categoryId).classList.add('active');
    });
  });

  const generateBtn = document.getElementById('generateBtn');
  const resultsContainer = document.getElementById('resultsContainer');
  const resultTitle = document.getElementById('resultTitle');
  const painPoint = document.getElementById('painPoint');
  const productIdeas = document.getElementById('productIdeas');
  const copyBtn = document.getElementById('copyBtn');
  const shareBtn = document.getElementById('shareBtn');
  const errorMessage = document.getElementById('errorMessage');
  const shareOptions = document.getElementById('shareOptions');
  const closeShare = document.getElementById('closeShare');
  const sharePlatforms = document.querySelectorAll('.share-platform');
  
  if (generateBtn) generateBtn.addEventListener('click', generateProductIdeas);
  if (copyBtn) copyBtn.addEventListener('click', copyResults);
  if (shareBtn) shareBtn.addEventListener('click', showShareOptions);
  if (closeShare) closeShare.addEventListener('click', hideShareOptions);
  
  sharePlatforms.forEach(platform => {
    platform.addEventListener('click', () => {
      shareToPlatform(platform.getAttribute('data-platform'));
    });
  });
  
  async function generateProductIdeas() {
    const activeTab = document.querySelector('.category-tab.active');
    const activeCategory = activeTab ? activeTab.getAttribute('data-category') : null;
    
    if (!activeCategory) {
      showError('Please select a category');
      return;
    }
    
    const selectId = `${activeCategory}Select`;
    const selectElement = document.getElementById(selectId);
    const selectedGroup = selectElement ? selectElement.value : null;
    
    if (!selectedGroup) {
      showError(`Please select an option from the ${activeTab.textContent} category`);
      return;
    }
    
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<div class="spinner"></div> Generating...';
    errorMessage.textContent = '';
    resultsContainer.style.display = 'none';
    
    try {
      const response = await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify({
          targetGroup: selectedGroup
        })
      });
      
      const data = await response.json();
      console.log('Backend Response:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate product ideas');
      }
      
      // Clear legacy visual label blocks to make room for clean template strings
      if (painPoint) painPoint.style.display = 'none'; 
      productIdeas.innerHTML = '';
      
      resultTitle.textContent = data.targetGroup;
      
      // Build a clean, styled text canvas for the custom layout output template
      const formattedContent = data.fullResponse || '';
      const contentDisplay = document.createElement('div');
      contentDisplay.style.whiteSpace = 'pre-wrap';
      contentDisplay.style.lineHeight = '1.7';
      contentDisplay.style.textAlign = 'left';
      contentDisplay.style.padding = '15px';
      contentDisplay.style.fontSize = '16px';
      contentDisplay.textContent = formattedContent;
      
      productIdeas.appendChild(contentDisplay);
      
      resultsContainer.style.display = 'block';
      resultsContainer.scrollIntoView({ behavior: 'smooth' });
      
    } catch (error) {
      console.error('Error:', error);
      showError(error.message || 'An error occurred. Please try again.');
    } finally {
      generateBtn.disabled = false;
      generateBtn.textContent = 'Generate Digital Product Ideas';
    }
  }
  
  function copyResults() {
    const title = resultTitle.textContent;
    const completeOutput = productIdeas.textContent; 
    const textToCopy = `Target Audience Strategy: ${title}\n\n${completeOutput}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      copyBtn.style.backgroundColor = '#00b894';
      
      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.backgroundColor = '';
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
      showError('Failed to copy text to clipboard.');
    });
  }
  
  function showShareOptions() {
    if (shareOptions) shareOptions.style.display = 'flex';
  }
  
  function hideShareOptions() {
    if (shareOptions) shareOptions.style.display = 'none';
  }
  
  function shareToPlatform(platform) {
    const title = resultTitle.textContent;
    const completeOutput = productIdeas.textContent;
    const shareText = `Check out this digital product blueprint for ${title}:\n\n${completeOutput}`;
    const shareUrl = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(shareText);
    
    let url = '';
    switch(platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${text}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${text}%20${shareUrl}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
    hideShareOptions();
  }
  
  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
      errorMessage.textContent = '';
      errorMessage.style.display = 'none';
    }, 5000);
  }

  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      generateProductIdeas();
    }
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const categoryId = this.getAttribute('data-category');
      const selectElement = document.getElementById(`${categoryId}Select`);
      if (selectElement) {
        setTimeout(() => { selectElement.focus(); }, 100);
      }
    });
  });

  document.querySelectorAll('select').forEach(select => {
    select.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        generateProductIdeas();
      }
    });
  });

  function loadSavedState() {
    const savedCategory = localStorage.getItem('lastCategory');
    const savedSelection = localStorage.getItem('lastSelection');
    if (savedCategory) {
      const savedTab = document.querySelector(`[data-category="${savedCategory}"]`);
      if (savedTab) {
        savedTab.click();
        if (savedSelection) {
          const selectElement = document.getElementById(`${savedCategory}Select`);
          if (selectElement) selectElement.value = savedSelection;
        }
      }
    }
  }

  function saveState() {
    const activeTab = document.querySelector('.category-tab.active');
    if (activeTab) {
      const category = activeTab.getAttribute('data-category');
      const selectElement = document.getElementById(`${category}Select`);
      const selection = selectElement ? selectElement.value : '';
      localStorage.setItem('lastCategory', category);
      localStorage.setItem('lastSelection', selection);
    }
  }

  tabs.forEach(tab => { tab.addEventListener('click', saveState); });
  document.querySelectorAll('select').forEach(select => { select.addEventListener('change', saveState); });

  loadSavedState();

  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        if (resultsContainer.style.display === 'block') {
          resultsContainer.style.animation = 'fadeIn 0.5s ease-out';
        }
      }
    });
  });

  observer.observe(resultsContainer, { attributes: true });

  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    return originalFetch.apply(this, args)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response;
      })
      .catch(error => {
        console.error('Fetch error:', error);
        if (error.message.includes('Failed to fetch')) {
          showError('Network error. Please check your connection and try again.');
        }
        throw error;
      });
  };
});
