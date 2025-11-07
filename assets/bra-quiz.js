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
    const resultDiv = quizContainer.querySelector('#bra-quiz-result');
    const successMessage = quizContainer.querySelector('.bra-quiz__success');
    const hasStoredSize = sessionStorage.getItem('bra-quiz-size');
    
    // Check if form was successfully submitted (either via form state or sessionStorage)
    if ((resultDiv && successMessage) || hasStoredSize) {
      // Form was successfully submitted - show success message and result
      const emailStep = quizContainer.querySelector('.bra-quiz__step--email');
      const allSteps = quizContainer.querySelectorAll('.bra-quiz__step');
      const progressSteps = quizContainer.querySelectorAll('.bra-quiz__progress-step');
      
      if (emailStep) {
        // Show the email step (which contains the success message)
        emailStep.classList.add('bra-quiz__step--active');
        
        const stepHeader = emailStep.querySelector('[data-step-header]');
        if (stepHeader) {
          stepHeader.style.display = 'none';
        }
        const emailDescription = emailStep.querySelector('.bra-quiz__email-description');
        if (emailDescription) {
          emailDescription.style.display = 'none';
        }
        const stepCard = emailStep.querySelector('.bra-quiz__step-card');
        if (stepCard) {
          stepCard.classList.add('bra-quiz__step-card--success');
        }
        
        // Hide other steps
        allSteps.forEach(step => {
          if (step !== emailStep) {
            step.classList.remove('bra-quiz__step--active');
          }
        });
        
        // Update progress bar to show all steps as complete
        progressSteps.forEach(progressStep => {
          progressStep.classList.add('bra-quiz__progress-step--active');
        });
      }
      
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
      
      // If form wasn't in success state, create the success message
      if (!resultDiv || !successMessage) {
        const emailStepContent = emailStep ? emailStep.querySelector('[data-step-content]') : null;
        if (emailStepContent) {
          emailStepContent.innerHTML = `
            <div class="bra-quiz__success">
              <p>Thank you! Your bra size has been calculated and saved.</p>
              <div id="bra-quiz-result" class="bra-quiz__success-size">
                <div class="bra-quiz__size-label">Your Recommended Bra Size</div>
                <div class="bra-quiz__size-value">${calculatedSize || '--'}</div>
              </div>
            </div>
          `;
        }
      }

      // Ensure the size is displayed in whichever result container exists
      let sizeValueEl = quizContainer.querySelector('#bra-quiz-result .bra-quiz__size-value');
      if (!sizeValueEl && emailStep) {
        sizeValueEl = emailStep.querySelector('.bra-quiz__size-value');
      }
      if (sizeValueEl && calculatedSize && calculatedSize !== 'Please complete all measurements') {
        sizeValueEl.textContent = calculatedSize;
      }
      
      // Clean up storage after a delay (so it persists if page is refreshed)
      setTimeout(() => {
        sessionStorage.removeItem('bra-quiz-size');
        sessionStorage.removeItem('bra-quiz-measurements');
      }, 5000);
      
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
      // Only save if not skipping (skip on initial load)
      if (!skipSave) {
        saveData();
      }
      
      // If showing results step, calculate and display size
      const currentStepElement = steps[stepNumber - 1];
      if (currentStepElement && currentStepElement.classList.contains('bra-quiz__step--results')) {
        const calculatedSize = calculateBraSize();
        const sizeDisplay = quizContainer.querySelector('#bra-quiz-size-display .bra-quiz__size-value');
        if (sizeDisplay) {
          sizeDisplay.textContent = calculatedSize;
        }
      }
      
      // Note: Size is NOT displayed in email step - only after form submission
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
      return `${bandSize}${cupSizeStr}`;
    }

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
          const sizeTag = 'bra-size-' + calculatedSize;
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
        if (contactBodyInput) {
          const noteData = {
            source: 'bra-quiz',
            bra_size: calculatedSize,
            measurements: measurements,
            calculated_at: new Date().toISOString(),
            tags: contactTagsInput ? contactTagsInput.value : undefined
          };
          contactBodyInput.value = JSON.stringify(noteData);
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
    
    // Debug: Log current state
    console.log('Quiz initialized - Current step:', currentStep, 'Measurements:', measurements);
  }

  // Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      // Find all bra quiz containers (only elements with class 'bra-quiz')
      const quizContainers = document.querySelectorAll('.bra-quiz[id^="bra-quiz-"]');
      quizContainers.forEach(function(container) {
        initBraQuiz(container.id);
      });
    });
  } else {
    // DOM already loaded
    const quizContainers = document.querySelectorAll('.bra-quiz[id^="bra-quiz-"]');
    quizContainers.forEach(function(container) {
      initBraQuiz(container.id);
    });
  }
})();

