/**
 * Bra Quiz JavaScript
 * Handles step-by-step navigation, measurement collection, and size calculation
 */

(function() {
  'use strict';

  // Initialize all bra quiz instances on the page
  function initBraQuiz(containerId) {
    const quizContainer = document.getElementById(containerId);
    if (!quizContainer) return;

    // Check if form was successfully posted - if so, just display result and return
    const successCard = quizContainer.querySelector('#bra-quiz-success-card');
    const emailStep = quizContainer.querySelector('.bra-quiz__step--email');
    const formInSuccessState = emailStep && emailStep.querySelector('form') && emailStep.querySelector('form').dataset.postedSuccessfully === 'true';
    
    // Check URL parameter for success state
    const urlParams = new URLSearchParams(window.location.search);
    const customerPosted = urlParams.get('customer_posted') === 'true';
    
    // Check if form was successfully submitted (only via form state or URL parameter, not sessionStorage)
    if (formInSuccessState || customerPosted) {
      // Hide video banner and quiz banner sections when results are shown
      const videoBannerSection = document.querySelector('[id*="video_banner"]');
      const quizBannerSection = document.querySelector('[id*="quiz_banner"]');
      
      if (videoBannerSection) {
        videoBannerSection.style.display = 'none';
      }
      if (quizBannerSection) {
        quizBannerSection.style.display = 'none';
      }
      
      // Show success-only sections (related products, collection list, quiz info card)
      const relatedProductsSection = document.querySelector('[id*="related_products"]');
      const collectionListSection = document.querySelector('[id*="collection_list"]');
      const quizInfoCardSection = document.querySelector('[id*="quiz_info_card"]');
      
      if (relatedProductsSection) {
        relatedProductsSection.style.display = '';
      }
      if (collectionListSection) {
        collectionListSection.style.display = '';
      }
      if (quizInfoCardSection) {
        quizInfoCardSection.style.display = '';
      }
      
      // Form was successfully submitted - show separate success card and hide email step
      const emailStep = quizContainer.querySelector('.bra-quiz__step--email');
      const successCard = quizContainer.querySelector('#bra-quiz-success-card');
      const allSteps = quizContainer.querySelectorAll('.bra-quiz__step');
      const progressSteps = quizContainer.querySelectorAll('.bra-quiz__progress-step');
      const quizHeader = quizContainer.querySelector('.bra-quiz__header');
      const progressBar = quizContainer.querySelector('.bra-quiz__progress');
      
      // Hide all quiz steps
      allSteps.forEach(step => {
        step.classList.remove('bra-quiz__step--active');
        step.style.display = 'none';
      });
      
      // Hide the email step card
      if (emailStep) {
        emailStep.style.display = 'none';
      }
      
      // Hide quiz header and progress bar
      if (quizHeader) {
        quizHeader.style.display = 'none';
      }
      if (progressBar) {
        progressBar.style.display = 'none';
      }
      
      // Show the separate success card
      if (successCard) {
        successCard.style.display = 'block';
      }
      
      // Update progress bar to show all steps as complete
      progressSteps.forEach(progressStep => {
        progressStep.classList.add('bra-quiz__progress-step--active');
      });
      
      // Get or calculate the size
      let calculatedSize = sessionStorage.getItem('bra-quiz-size');
      
      if (!calculatedSize || calculatedSize === 'Please complete all measurements') {
        const storedMeasurements = sessionStorage.getItem('bra-quiz-measurements');
        if (storedMeasurements) {
          try {
            const tempMeasurements = JSON.parse(storedMeasurements);
            // Recalculate from stored measurements using the full calculation function
            // We'll need to call calculateBraSize with the stored measurements
            // For now, let's use a simplified calculation
            const su = parseFloat(tempMeasurements.snug_underband) || 0;
            const tu = parseFloat(tempMeasurements.tight_underband) || 0;
            const so = parseFloat(tempMeasurements.standing_overbust) || 0;
            const lo = parseFloat(tempMeasurements.leaning_overbust) || 0;
            
            if (su && tu && so && lo) {
              const bandSize = Math.min(Math.round(su), Math.round(tu + 2));
              const avgBust = (so + lo) / 2;
              const cupDifference = avgBust - su;
              
              if (cupDifference >= 5 && cupDifference <= 15) {
                const cupOrder = ['D', 'DD', 'E', 'F', 'FF', 'G', 'GG', 'H', 'HH', 'J', 'JJ', 'K', 'KK', 'L'];
                const cupIndex = Math.floor(cupDifference) - 5;
                if (cupIndex >= 0 && cupIndex < cupOrder.length) {
                  calculatedSize = bandSize + cupOrder[cupIndex];
                }
              }
            }
          } catch (e) {
            console.error('Error parsing stored measurements:', e);
          }
        }
      }
      
      // Ensure the size is displayed in the success card
      let sizeValueEl = quizContainer.querySelector('#bra-quiz-success-card .bra-quiz__size-value');
      if (!sizeValueEl) {
        sizeValueEl = quizContainer.querySelector('#bra-quiz-result .bra-quiz__size-value');
      }
      if (sizeValueEl && calculatedSize && calculatedSize !== 'Please complete all measurements') {
        sizeValueEl.textContent = calculatedSize;
      }
      
      // Don't clean up storage immediately - keep it for page refresh
      // Only clean up after a longer delay or when user navigates away
      
      // Don't initialize quiz - just return
      return;
    }

    const steps = quizContainer.querySelectorAll('.bra-quiz__step');
    const progressSteps = quizContainer.querySelectorAll('.bra-quiz__progress-step');
    const storageKey = 'bra-quiz-' + containerId;
    let currentStep = 1;
    const measurements = {};

    // Load saved data from localStorage
    function loadSavedData() {
      try {
        const savedData = localStorage.getItem(storageKey);
        console.log('Attempting to load from storage key:', storageKey);
        if (savedData) {
          const data = JSON.parse(savedData);
          console.log('Found saved data:', data);
          if (data.measurements) {
            Object.assign(measurements, data.measurements);
            console.log('Loaded measurements:', measurements);
          }
          // Don't restore currentStep - always start from step 1
          // This prevents jumping to email step on page load
          return data;
        } else {
          console.log('No saved data found for key:', storageKey);
        }
      } catch (e) {
        console.error('Error loading saved quiz data:', e);
      }
      return null;
    }

    // Save data to localStorage
    function saveData() {
      try {
        const dataToSave = {
          measurements: measurements,
          currentStep: currentStep,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem(storageKey, JSON.stringify(dataToSave));
        console.log('Saved quiz data to', storageKey, ':', dataToSave);
      } catch (e) {
        console.error('Error saving quiz data:', e);
      }
    }

    // Clear saved data from localStorage
    function clearSavedData() {
      try {
        localStorage.removeItem(storageKey);
      } catch (e) {
        console.error('Error clearing quiz data:', e);
      }
    }

    // Populate inputs with saved values
    function populateSavedValues() {
      let populatedCount = 0;
      steps.forEach(function(step) {
        // Populate measurement inputs
        const input = step.querySelector('.bra-quiz__input');
        if (input && input.dataset.measurement) {
          const measurementKey = input.dataset.measurement;
          if (measurements[measurementKey] !== undefined && measurements[measurementKey] !== null) {
            input.value = measurements[measurementKey];
            populatedCount++;
            console.log('Populated input:', measurementKey, '=', measurements[measurementKey]);
          }
        }

        // Populate radio buttons
        const radios = step.querySelectorAll('.bra-quiz__radio');
        radios.forEach(function(radio) {
          const questionKey = radio.dataset.question;
          if (questionKey && measurements[questionKey] === radio.value) {
            radio.checked = true;
            populatedCount++;
            console.log('Populated radio:', questionKey, '=', radio.value);
          }
        });
      });
      
      if (populatedCount > 0) {
        console.log('Populated', populatedCount, 'field(s) with saved values');
      }
    }

    function showStep(stepNumber, skipSave) {
      steps.forEach((step, index) => {
        if (index + 1 === stepNumber) {
          step.classList.add('bra-quiz__step--active');
        } else {
          step.classList.remove('bra-quiz__step--active');
        }
      });

      progressSteps.forEach((progressStep, index) => {
        if (index + 1 <= stepNumber) {
          progressStep.classList.add('bra-quiz__progress-step--active');
        } else {
          progressStep.classList.remove('bra-quiz__progress-step--active');
        }
      });

      currentStep = stepNumber;
      
      // Update clickability after step change
      updateProgressStepClickability();
      // Only save if not skipping (skip on initial load)
      if (!skipSave) {
        saveData();
      }
      
      // Size display is now handled by the separate success card
      
      // Note: Size is NOT displayed in email step - only after form submission
    }

    // Handle question step image switching based on selected option
    function updateQuestionIllustration(stepElement) {
      const questionIllustration = stepElement.querySelector('[data-question-illustration]');
      if (!questionIllustration) return;

      const selectedRadio = stepElement.querySelector('.bra-quiz__radio:checked');
      if (!selectedRadio) {
        // Hide all images if no option is selected
        questionIllustration.querySelectorAll('.bra-quiz__option-image').forEach(img => {
          img.style.display = 'none';
        });
        return;
      }

      // Get the option index from the radio button's parent label
      const optionLabel = selectedRadio.closest('.bra-quiz__option');
      const optionIndex = optionLabel ? optionLabel.getAttribute('data-option-index') : null;

      if (optionIndex) {
        // Hide all images
        questionIllustration.querySelectorAll('.bra-quiz__option-image').forEach(img => {
          img.style.display = 'none';
        });

        // Show the image for the selected option
        const selectedImage = questionIllustration.querySelector(`[data-option-image="${optionIndex}"]`);
        if (selectedImage) {
          selectedImage.style.display = 'flex';
        }
      }
    }

    // Update showStep to also update question illustration
    const originalShowStep = showStep;
    showStep = function(stepNumber, skipSave) {
      originalShowStep(stepNumber, skipSave);
      const currentStepElement = steps[stepNumber - 1];
      if (currentStepElement) {
        updateQuestionIllustration(currentStepElement);
      }
    };

    // Check if a step is completed (has data)
    function isStepCompleted(stepNumber) {
      if (stepNumber === 1) return true; // First step is always accessible
      
      const stepElement = steps[stepNumber - 1];
      if (!stepElement) return false;
      
      // Check if it's a measurement step
      const input = stepElement.querySelector('.bra-quiz__input');
      if (input && input.dataset.measurement) {
        const measurementKey = input.dataset.measurement;
        return measurements[measurementKey] !== undefined && measurements[measurementKey] !== null;
      }
      
      // Check if it's a question step
      const radios = stepElement.querySelectorAll('.bra-quiz__radio');
      if (radios.length > 0) {
        for (let radio of radios) {
          const questionKey = radio.dataset.question;
          if (questionKey && measurements[questionKey] !== undefined && measurements[questionKey] !== null) {
            return true;
          }
        }
      }
      
      // Results step has been removed - results are now shown in a separate success card
      
      // Email step is always accessible if we've reached it
      if (stepElement.classList.contains('bra-quiz__step--email')) {
        return currentStep >= stepNumber;
      }
      
      return false;
    }

    function collectMeasurement(stepElement) {
      const input = stepElement.querySelector('.bra-quiz__input');
      const radio = stepElement.querySelector('.bra-quiz__radio:checked');
      
      console.log('collectMeasurement called - input:', input, 'radio:', radio);
      
      if (input && input.value) {
        const measurementKey = input.dataset.measurement;
        measurements[measurementKey] = parseFloat(input.value);
        console.log('Collected measurement:', measurementKey, '=', measurements[measurementKey]);
        saveData(); // Save immediately when measurement is collected
        return true;
      } else if (radio) {
        const questionKey = radio.dataset.question;
        measurements[questionKey] = radio.value;
        console.log('Collected question answer:', questionKey, '=', measurements[questionKey]);
        saveData(); // Save immediately when option is selected
        return true;
      }
      console.log('No measurement collected - input value:', input?.value, 'radio checked:', radio?.checked);
      return false;
    }

    // Note: Values are saved only when the Next/Continue button is clicked
    // This happens in collectMeasurement() which is called on button click

    // Helper function to round band size based on SU rules
    function roundBandSizeSU(su) {
      const wholePart = Math.floor(su);
      const decimalPart = su - wholePart;
      
      // If even whole number, use it
      if (decimalPart === 0 && wholePart % 2 === 0) {
        return wholePart;
      }
      
      // If odd whole number or odd with decimal, round up to next even
      if (wholePart % 2 !== 0) {
        return Math.ceil(su / 2) * 2;
      }
      
      // If even with decimal 0.01-0.50, round down to that even number
      if (decimalPart >= 0.01 && decimalPart <= 0.50) {
        return wholePart;
      }
      
      // If even with decimal 0.51-0.99, round up to next even number
      if (decimalPart > 0.50 && decimalPart < 1) {
        return wholePart + 2;
      }
      
      return wholePart;
    }

    // Helper function to get cup size from difference
    function getCupSize(difference) {
      const cupMap = {
        4: 'D',
        5: 'DD',
        6: 'E',
        7: 'F',
        8: 'FF',
        9: 'G',
        10: 'GG',
        11: 'H',
        12: 'HH',
        13: 'J',
        14: 'JJ',
        15: 'K',
        16: 'KK',
        17: 'L'
      };
      return cupMap[difference] || '';
    }

    // Helper function to adjust cup size
    function adjustCupSize(cupSize, adjustment) {
      const cupOrder = ['D', 'DD', 'E', 'F', 'FF', 'G', 'GG', 'H', 'HH', 'J', 'JJ', 'K', 'KK', 'L'];
      const index = cupOrder.indexOf(cupSize);
      if (index === -1) return cupSize;
      
      const newIndex = Math.max(0, Math.min(cupOrder.length - 1, index + adjustment));
      return cupOrder[newIndex];
    }

    function calculateBraSize() {
      // Get measurements
      const su = parseFloat(measurements.snug_underband) || 0;
      const tu = parseFloat(measurements.tight_underband) || 0;
      const so = parseFloat(measurements.standing_overbust) || 0;
      const lo = parseFloat(measurements.leaning_overbust) || 0;
      const space = measurements.breast_space || '';

      // Validate that we have the required measurements
      if (!su || !tu || !so || !lo) {
        return 'Please complete all measurements';
      }

      // Check for size not available conditions
      if (su < 25 || tu < 23 || su > 40.5 || tu > 38.5) {
        return 'Sorry, we don\'t carry your size yet - but we\'re working on it!';
      }

      // I. Calculate Band Size
      // Method A: Using SU
      const bandSizeA = roundBandSizeSU(su);
      
      // Method B: Using TU + 2
      const tuPlus2 = tu + 2;
      const bandSizeB = roundBandSizeSU(tuPlus2);
      
      // Choose the smaller of the two
      let bandSize = Math.min(bandSizeA, bandSizeB);

      // II. Calculate Cup Size
      // Base cup calculation: (SO + LO) / 2 - SU
      const avgBust = (so + lo) / 2;
      const cupDifference = avgBust - su;
      
      // Check if cup size is out of range
      if (cupDifference > 15 || cupDifference < 5) {
        return 'Sorry, we don\'t carry your size yet - but we\'re working on it!';
      }

      // Rounding rules for cup difference
      const wholePart = Math.floor(cupDifference);
      const decimalPart = cupDifference - wholePart;
      
      let baseCupSizes = [];
      
      if (decimalPart >= 0.01 && decimalPart <= 0.24) {
        // Round down
        baseCupSizes = [wholePart];
      } else if (decimalPart >= 0.25 && decimalPart <= 0.59) {
        // Adjacent cup rule - use both
        baseCupSizes = [wholePart, wholePart + 1];
      } else if (decimalPart >= 0.60 && decimalPart <= 0.99) {
        // Round up
        baseCupSizes = [wholePart + 1];
      } else {
        // Exactly whole number
        baseCupSizes = [wholePart];
      }

      // Map to cup sizes
      let cupSizes = baseCupSizes.map(diff => getCupSize(diff)).filter(cup => cup !== '');

      // Adjust based on breast spacing
      if (space === 'no_space' || space === 'CS') {
        // Close-Set: add one cup size
        cupSizes = cupSizes.map(cup => adjustCupSize(cup, 1));
      } else if (space === 'more_than_2_fingers' || space === 'SS') {
        // Side-Set: subtract one cup size
        cupSizes = cupSizes.map(cup => adjustCupSize(cup, -1));
      }
      // Average Space (1-2_fingers, AS, or any other value): keep same (no adjustment)

      // Remove duplicates and format
      cupSizes = [...new Set(cupSizes)];
      
      // Format result
      if (cupSizes.length === 0) {
        return 'Sorry, we don\'t carry your size yet - but we\'re working on it!';
      }

      const cupSizeStr = cupSizes.length === 1 ? cupSizes[0] : cupSizes.join('/');
      return `${bandSize} ${cupSizeStr}`;
    }

    // Check if all required measurements are completed
    function areAllMeasurementsCompleted() {
      const requiredKeys = ['snug_underband', 'tight_underband', 'standing_overbust', 'leaning_overbust'];
      const allMeasurementsComplete = requiredKeys.every(key => 
        measurements[key] !== undefined && measurements[key] !== null
      );
      
      // Also check if question step is completed (if it exists)
      const questionKeys = Object.keys(measurements).filter(key => 
        !requiredKeys.includes(key) && measurements[key] !== undefined && measurements[key] !== null
      );
      
      return allMeasurementsComplete;
    }

    // Update progress step clickability - allow forward and backward navigation
    function updateProgressStepClickability() {
      progressSteps.forEach((progressStep, index) => {
        const stepNumber = index + 1;
        // Allow navigation to any step (forward or backward)
        progressStep.classList.add('bra-quiz__progress-step--completed');
        progressStep.classList.remove('bra-quiz__progress-step--disabled');
      });
    }

    // Progress step click handlers - allow forward and backward navigation
    progressSteps.forEach((progressStep, index) => {
      progressStep.addEventListener('click', function() {
        const targetStep = index + 1;
        // Allow navigation to any step
        showStep(targetStep);
      });
    });

    // Update clickability on load and after each step
    updateProgressStepClickability();

    // Add change event listeners to radio buttons for question steps
    steps.forEach(function(step) {
      const radios = step.querySelectorAll('.bra-quiz__radio');
      radios.forEach(function(radio) {
        radio.addEventListener('change', function() {
          updateQuestionIllustration(step);
        });
      });
    });

    // Next button handlers
    quizContainer.addEventListener('click', function(e) {
      if (e.target.closest('[data-next-step]')) {
        e.preventDefault();
        const stepElement = e.target.closest('.bra-quiz__step');
        
        if (collectMeasurement(stepElement)) {
          if (currentStep < steps.length) {
            showStep(currentStep + 1);
          }
        } else {
          alert('Please enter a measurement or select an option');
        }
      }
    });

    // Form submission - use Shopify customer form
    const form = quizContainer.querySelector('#bra-quiz-form');
    if (form) {
      form.addEventListener('submit', function(e) {
        // Get email from form
        const emailInput = form.querySelector('#bra-quiz-email');
        const email = emailInput ? emailInput.value.trim() : '';
        
        if (!email) {
          console.error('Email is required');
          e.preventDefault();
          return false;
        }
        
        // Check if all required measurements are completed
        if (!areAllMeasurementsCompleted()) {
          e.preventDefault();
          alert('Please complete all measurement steps before submitting.');
          // Navigate to first incomplete step
          const requiredKeys = ['snug_underband', 'tight_underband', 'standing_overbust', 'leaning_overbust'];
          for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            const input = step.querySelector('.bra-quiz__input');
            if (input && input.dataset.measurement) {
              const measurementKey = input.dataset.measurement;
              if (requiredKeys.includes(measurementKey) && 
                  (measurements[measurementKey] === undefined || measurements[measurementKey] === null)) {
                showStep(i + 1);
                break;
              }
            }
          }
          return false;
        }
        
        // Calculate bra size before submission
        const calculatedSize = calculateBraSize();
        
        // Store size and measurements in sessionStorage for display after redirect
        if (calculatedSize && calculatedSize !== 'Please complete all measurements') {
          sessionStorage.setItem('bra-quiz-size', calculatedSize);
          sessionStorage.setItem('bra-quiz-measurements', JSON.stringify(measurements));
        }
        
        // Set contact tags - include bra size as a tag (Shopify handles customer creation similar to newsletter)
        const contactTagsInput = form.querySelector('#bra-quiz-contact-tags');
        if (contactTagsInput && calculatedSize && calculatedSize !== 'Please complete all measurements') {
          // Check if size is not available (error message)
          const isSizeNotAvailable = calculatedSize.includes("don't carry your size") || calculatedSize.includes("don't carry");
          const sizeTag = isSizeNotAvailable ? 'bra-size-not-available' : 'bra-size-' + calculatedSize.replace(/\s+/g, '-');
          
          const existingTags = (contactTagsInput.value || '')
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

          const filteredTags = existingTags.filter(tag => !/^bra-size-/i.test(tag));

          if (!filteredTags.includes('bra-quiz')) {
            filteredTags.push('bra-quiz');
          }

          filteredTags.push(sizeTag);
          contactTagsInput.value = filteredTags.join(', ');
        }
        
        // Store structured data in contact body for reference/webhook processing
        const contactBodyInput = form.querySelector('#bra-quiz-contact-body');
        const customerNoteInput = form.querySelector('#bra-quiz-customer-note');
        if (contactBodyInput) {
          const noteData = {
            source: 'bra-quiz',
            bra_size: calculatedSize,
            measurements: measurements,
            calculated_at: new Date().toISOString(),
            tags: contactTagsInput ? contactTagsInput.value : undefined
          };
          contactBodyInput.value = JSON.stringify(noteData);

          if (customerNoteInput) {
            customerNoteInput.value = JSON.stringify(noteData);
          }
        }
        
        // Let Shopify handle the form submission and captcha
        // Don't prevent default - let the form submit normally
      });
    }


    // Initialize: Load saved data and populate values
    const loadedData = loadSavedData();
    if (loadedData) {
      console.log('Loaded quiz data:', loadedData);
    }
    populateSavedValues();
    // Show step without saving (skipSave = true on initial load)
    showStep(currentStep, true);
    // Update clickability after data is loaded
    updateProgressStepClickability();
    
    // Debug: Log current state
    console.log('Quiz initialized - Current step:', currentStep, 'Measurements:', measurements);
  }

  // Hide banners immediately if results are already shown (check sessionStorage or URL)
  function hideBannersIfResultsShown() {
    const urlParams = new URLSearchParams(window.location.search);
    const customerPosted = urlParams.get('customer_posted') === 'true';
    
    // Only hide quiz if URL parameter is present (not just sessionStorage)
    if (customerPosted) {
      const videoBannerSection = document.querySelector('[id*="video_banner"]');
      const quizBannerSection = document.querySelector('[id*="quiz_banner"]');
      const quizHeader = document.querySelector('.bra-quiz__header');
      const progressBar = document.querySelector('.bra-quiz__progress');
      const quizSteps = document.querySelector('.bra-quiz__steps');
      const successCard = document.querySelector('#bra-quiz-success-card');
      
      if (videoBannerSection) {
        videoBannerSection.style.display = 'none';
      }
      if (quizBannerSection) {
        quizBannerSection.style.display = 'none';
      }
      
      // Show success-only sections (related products, collection list, quiz info card)
      const relatedProductsSection = document.querySelector('[id*="related_products"]');
      const collectionListSection = document.querySelector('[id*="collection_list"]');
      const quizInfoCardSection = document.querySelector('[id*="quiz_info_card"]');
      
      if (relatedProductsSection) {
        relatedProductsSection.style.display = '';
      }
      if (collectionListSection) {
        collectionListSection.style.display = '';
      }
      if (quizInfoCardSection) {
        quizInfoCardSection.style.display = '';
      }
      if (quizHeader) {
        quizHeader.style.display = 'none';
      }
      if (progressBar) {
        progressBar.style.display = 'none';
      }
      if (quizSteps) {
        quizSteps.style.display = 'none';
      }
      if (successCard) {
        successCard.style.display = 'block';
        
        // Try to display the size if available from sessionStorage
        const sizeValueEl = successCard.querySelector('.bra-quiz__size-value');
        if (sizeValueEl) {
          const hasStoredSize = sessionStorage.getItem('bra-quiz-size');
          if (hasStoredSize) {
            sizeValueEl.textContent = hasStoredSize;
          } else if (customerPosted) {
            // If URL parameter is present but no sessionStorage, try to get from stored measurements
            const storedMeasurements = sessionStorage.getItem('bra-quiz-measurements');
            if (storedMeasurements) {
              try {
                const measurements = JSON.parse(storedMeasurements);
                // Recalculate size from measurements
                const su = parseFloat(measurements.snug_underband) || 0;
                const tu = parseFloat(measurements.tight_underband) || 0;
                const so = parseFloat(measurements.standing_overbust) || 0;
                const lo = parseFloat(measurements.leaning_overbust) || 0;
                
                if (su && tu && so && lo) {
                  // Use simplified calculation for display on refresh
                  // Full calculation is done in the main function
                  const bandSize = Math.min(Math.round(su), Math.round(tu + 2));
                  const avgBust = (so + lo) / 2;
                  const cupDifference = avgBust - su;
                  
                  if (cupDifference >= 5 && cupDifference <= 15) {
                    const cupOrder = ['D', 'DD', 'E', 'F', 'FF', 'G', 'GG', 'H', 'HH', 'J', 'JJ', 'K', 'KK', 'L'];
                    const cupIndex = Math.floor(cupDifference) - 5;
                    if (cupIndex >= 0 && cupIndex < cupOrder.length) {
                      const calculatedSize = 'UK ' + bandSize + ' ' + cupOrder[cupIndex];
                      sizeValueEl.textContent = calculatedSize;
                    }
                  }
                }
              } catch (e) {
                console.error('Error parsing stored measurements:', e);
              }
            }
          }
        }
      }
    }
  }

  // Check immediately if DOM is already loaded
  if (document.readyState !== 'loading') {
    hideBannersIfResultsShown();
    // Hide success-only sections on normal state
    const urlParams = new URLSearchParams(window.location.search);
    const customerPosted = urlParams.get('customer_posted') === 'true';
    if (!customerPosted) {
      const relatedProductsSection = document.querySelector('[id*="related_products"]');
      const collectionListSection = document.querySelector('[id*="collection_list"]');
      const quizInfoCardSection = document.querySelector('[id*="quiz_info_card"]');
      
      if (relatedProductsSection) {
        relatedProductsSection.style.display = 'none';
      }
      if (collectionListSection) {
        collectionListSection.style.display = 'none';
      }
      if (quizInfoCardSection) {
        quizInfoCardSection.style.display = 'none';
      }
    }
  }

  // Function to hide success-only sections on normal state
  function hideSuccessOnlySections() {
    const urlParams = new URLSearchParams(window.location.search);
    const customerPosted = urlParams.get('customer_posted') === 'true';
    
    if (!customerPosted) {
      const relatedProductsSection = document.querySelector('[id*="related_products"]');
      const collectionListSection = document.querySelector('[id*="collection_list"]');
      const quizInfoCardSection = document.querySelector('[id*="quiz_info_card"]');
      
      if (relatedProductsSection) {
        relatedProductsSection.style.display = 'none';
      }
      if (collectionListSection) {
        collectionListSection.style.display = 'none';
      }
      if (quizInfoCardSection) {
        quizInfoCardSection.style.display = 'none';
      }
    }
  }

  // Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      hideBannersIfResultsShown();
      hideSuccessOnlySections();
      // Find all bra quiz containers (only elements with class 'bra-quiz')
      const quizContainers = document.querySelectorAll('.bra-quiz[id^="bra-quiz-"]');
      quizContainers.forEach(function(container) {
        initBraQuiz(container.id);
      });
    });
  } else {
    // DOM already loaded
    hideBannersIfResultsShown();
    hideSuccessOnlySections();
    const quizContainers = document.querySelectorAll('.bra-quiz[id^="bra-quiz-"]');
    quizContainers.forEach(function(container) {
      initBraQuiz(container.id);
    });
  }
})();

