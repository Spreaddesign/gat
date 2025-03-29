let currentSection = 0;
    let currentSubSection = 0;
    let isScrolling = false;
    let startX = 0;
    let endX = 0;
    let startY = 0;
    let endY = 0;
    let isDragging = false;
    let isViewSwitching = false;
    let isMuted = true; // Track mute state across videos
    
    const mobileView = document.getElementById("mobileView");
    const webView = document.getElementById("webView");
    const dragBtn = document.getElementById("dragBtn");
    const webDragBtn = document.getElementById("webDragBtn");
    const videoWrap = document.getElementById("videoWrap");

    // Set viewport height variable
    function setMobileHeight() {
      // Get the actual viewport height
      const vh = window.innerHeight * 0.01;
      // Set the value as a CSS variable
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      // Force layout recalculation by applying the same transform again
      if (currentSection > 0) {
        updateView(true);
      }
    }

    // Set the height on initial load
    setMobileHeight();

    // Update on resize and orientation change
    window.addEventListener('resize', setMobileHeight);
    window.addEventListener('orientationchange', setMobileHeight);

    // Setup mute/unmute for all videos
    const videoContainers = document.querySelectorAll('.video-container');

    videoContainers.forEach(container => {
      const video = container.querySelector('.section-video');
      const muteUnmuteBtn = container.querySelector('.mute-unmute-btn');
      
      // Load video data on page load to ensure visibility
      video.addEventListener('loadedmetadata', function() {
        // This ensures the video dimensions are set properly
        video.style.display = 'block';
      });

      // Setup mute/unmute button click with stopPropagation to prevent view switching
      if (muteUnmuteBtn) {
        muteUnmuteBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleMute(video, muteUnmuteBtn);
        });
      }
    });

    // Function to toggle mute state
    function toggleMute(video, button) {
      // Prevent any view switching while handling video
      isViewSwitching = true;
      setTimeout(() => { isViewSwitching = false; }, 100);
      
      isMuted = !isMuted;
      
      // Set mute state on all videos to keep them consistent
      document.querySelectorAll('.section-video').forEach(v => {
        v.muted = isMuted;
      });
      
      // Update all buttons to show correct icon
      document.querySelectorAll('.mute-unmute-btn').forEach(btn => {
                // Make sure the parent control container is visible
                btn.closest('.video-controls').style.opacity = '1';
                btn.closest('.video-controls').style.visibility = 'visible';
                
        if (isMuted) {
          btn.innerHTML = '<svg class="icon-mute" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" fill="currentColor"/></svg>';
        } else {
          btn.innerHTML = '<svg class="icon-volume" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor"/></svg>';
        }
      });
    }

    // Existing scrolling functionality with wheel
    document.addEventListener("wheel", (event) => {
      if (webView.classList.contains('active') || isScrolling) return;
      isScrolling = true;

      if (event.deltaY > 0 && currentSection < 2) {
        currentSection++;
        currentSubSection = 0;
      } else if (event.deltaY < 0 && currentSection > 0) {
        currentSection--;
        currentSubSection = 0;
      }
      updateView();
      setTimeout(() => isScrolling = false, 800);
    });

    // Main container touch events for section navigation (vertical swipes)
    videoWrap.addEventListener("touchstart", (e) => {
      if (webView.classList.contains('active')) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    videoWrap.addEventListener("touchend", (e) => {
      if (webView.classList.contains('active') || isScrolling || isViewSwitching) return;
      
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
      
      // Calculate the horizontal and vertical differences
      const diffX = Math.abs(startX - endX);
      const diffY = Math.abs(startY - endY);
      
      // If vertical swipe is more significant than horizontal swipe
      if (diffY > diffX && diffY > 50) {
        isScrolling = true;
        
        // Vertical swipe - change sections
        if (startY - endY > 50 && currentSection < 2) {
          // Swipe up
          currentSection++;
          currentSubSection = 0;
          updateView();
        } else if (endY - startY > 50 && currentSection > 0) {
          // Swipe down
          currentSection--;
          currentSubSection = 0;
          updateView();
        }
        
        setTimeout(() => isScrolling = false, 800);
      }
      // Let the sub-section handlers deal with horizontal swipes
    });

    // Sub-section touch events (horizontal swipes)
    document.querySelectorAll(".sub-sections").forEach(subSection => {
      subSection.addEventListener("touchstart", (e) => {
        if (webView.classList.contains('active')) return;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      });
      
      subSection.addEventListener("touchend", (e) => {
        if (webView.classList.contains('active') || isScrolling || isViewSwitching) return;
        
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        
        // Calculate the horizontal and vertical differences
        const diffX = Math.abs(startX - endX);
        const diffY = Math.abs(startY - endY);
        
        // If horizontal swipe is more significant than vertical swipe
        if (diffX > diffY && diffX > 50) {
          let totalSubSections = subSection.children.length;

          if (startX - endX > 50 && currentSubSection < totalSubSections - 1) {
            // Swipe left
            currentSubSection++;
            updateView();
          } else if (endX - startX > 50 && currentSubSection > 0) {
            // Swipe right
            currentSubSection--;
            updateView();
          }
        }
      });
    });


    // Make sure video controls are always visible
    function ensureControlsVisible() {
      document.querySelectorAll('.video-controls').forEach(control => {
        control.style.opacity = '1';
        control.style.visibility = 'visible';
      });
    }
    
    // Set up an interval to keep controls visible
    setInterval(ensureControlsVisible, 500);


    // Updated view function to auto-play videos for current section/subsection
    function updateView(forceUpdate = false) {
      // Use transform with translateY instead of vh units directly
      const translateY = currentSection * 100;
      videoWrap.style.transform = `translateY(-${translateY}%)`;
      
      // Update sub-section position
      const subSections = document.querySelectorAll(".sub-sections");
      if (subSections[currentSection]) {
        const translateX = currentSubSection * 100;
        subSections[currentSection].style.transform = `translateX(-${translateX}%)`;
      }

      // After transform, ensure heights are correct by triggering a reflow
      if (forceUpdate) {
        // This forces a reflow to ensure heights are calculated properly
        void videoWrap.offsetHeight;
        
        // Re-apply the transform after the reflow
        videoWrap.style.transform = `translateY(-${translateY}%)`;
      }

      // First, pause all videos
      document.querySelectorAll('.section-video').forEach(video => {
        video.pause();
      });

      // Then play only the current section/subsection video
      try {
        const currentVideoContainer = subSections[currentSection].children[currentSubSection];
        if (currentVideoContainer) {
          const currentVideo = currentVideoContainer.querySelector('.section-video');
          if (currentVideo) {
            // Set mute state based on global preference
            currentVideo.muted = isMuted;
            
            // Play the video
            const playPromise = currentVideo.play();
            
            // Handle play promise to catch potential errors
            if (playPromise !== undefined) {
              playPromise.catch(error => {
                console.log("Autoplay was prevented:", error);
                // You might want to add fallback behavior here if needed
              });
            }
          }
        }
      } catch (e) {
        console.error("Error playing video:", e);
      }
    }
    
    // Drag button click to show web view
    dragBtn.addEventListener("click", () => {
      if (isViewSwitching) return;
      showWebView();
    });
    
    // Web drag button click to show mobile view
    webDragBtn.addEventListener("click", () => {
      if (isViewSwitching) return;
      showMobileView();
    });
    
    // Add touch swipe handling for mobile view to web view transition
    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchmove', (e) => {
      if (isViewSwitching) return;
      
      if (!isDragging && !webView.classList.contains('active')) {
        // For mobile to web transition, only start dragging when near left edge
        if (startX < 100) {
          isDragging = true;
        }
      }
      
      if (!isDragging && webView.classList.contains('active')) {
        // For web to mobile transition, only start dragging when near right edge
        if (startX > window.innerWidth - 100) {
          isDragging = true;
        }
      }
      
      if (isDragging) {
        let currentX = e.touches[0].clientX;
        let diffX = currentX - startX;
        
        if (!webView.classList.contains('active')) {
          // Mobile to web transition
          if (diffX > 0) {
            let progress = Math.min(diffX / window.innerWidth, 1);
            webView.style.left = `${100 - (progress * 100)}%`;
            mobileView.style.left = `${progress * 100}%`;
          }
        } else {
          // Web to mobile transition
          if (diffX < 0) {
            let progress = Math.min(Math.abs(diffX) / window.innerWidth, 1);
            webView.style.left = `${progress * 100}%`;
            mobileView.style.left = `${-100 + (progress * 100)}%`;
          }
        }
      }
    });
    
    document.addEventListener('touchend', (e) => {
      if (!isDragging || isViewSwitching) return;
      
      endX = e.changedTouches[0].clientX;
      let diffX = endX - startX;
      
      if (!webView.classList.contains('active')) {
        // Mobile to web transition
        if (diffX > window.innerWidth / 3) {
          showWebView();
        } else {
          // Reset position
          webView.style.left = '100%';
          mobileView.style.left = '0';
        }
      } else {
        // Web to mobile transition
        if (diffX < -window.innerWidth / 3) {
          showMobileView();
        } else {
          // Reset position
          webView.style.left = '0';
          mobileView.style.left = '-100%';
        }
      }
      
      isDragging = false;
    });
    
    function showWebView() {
      isViewSwitching = true;
      
      // Pause all videos when switching views
      document.querySelectorAll('.section-video').forEach(video => {
        video.pause();
      });
      
      webView.classList.add('active');
      webView.style.left = '0';
      
      mobileView.classList.add('hidden');
      mobileView.style.left = '-100%';
      

  // Add 'active' class to body when webView is active
   document.body.classList.add('active');

      setTimeout(() => {
        isViewSwitching = false;
      }, 500);
    }
    
    function showMobileView() {
      isViewSwitching = true;
      
      webView.classList.remove('active');
      webView.style.left = '100%';
      
      mobileView.classList.remove('hidden');
      mobileView.style.left = '0';
      
  // Remove 'active' class from body when webView is not active
  document.body.classList.remove('active');

      // Update vh after view switch to ensure correct dimensions
      setTimeout(() => {
        isViewSwitching = false;
        setMobileHeight();
        
        // Auto-play the current video when returning to mobile view
        updateView();
      }, 500);
    }
    
    // Initialize the view heights after all content is loaded
    window.addEventListener('load', () => {
      setMobileHeight();
      
      // Preload video metadata for all videos
      document.querySelectorAll('.section-video').forEach(video => {
        video.load();
      });
      
      // Force a layout recalculation
      updateView(true);
    });
    
    // Update height after any transition ends to ensure consistent dimensions
    videoWrap.addEventListener('transitionend', () => {
      setMobileHeight();
    });