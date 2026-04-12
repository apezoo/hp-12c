/**
 * HP-12C Educational Key Information System
 * Handles tooltips, Learn Mode, and detail page rendering
 * 
 * Depends on: key-metadata.js (must load first)
 */

(function() {
    'use strict';
    
    // Check if metadata is loaded
    if (typeof window.HP12C_KEY_METADATA === 'undefined') {
        console.error('key-metadata.js must be loaded before key-info.js');
        return;
    }
    
    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    /**
     * Get metadata for a specific key
     * @param {string} dataKey - The data-key attribute value
     * @returns {object|null} Key metadata or null if not found
     */
    function getKeyMetadata(dataKey) {
        return window.HP12C_KEY_METADATA[dataKey] || null;
    }
    
    /**
     * Generate status badge HTML
     * @param {string} status - Implementation status
     * @returns {string} HTML for status badge
     */
    function getStatusBadge(status) {
        const badges = {
            'implemented': { emoji: '✅', text: 'Implemented' },
            'partially-implemented': { emoji: '⚙️', text: 'Partially' },
            'planned': { emoji: '⚠️', text: 'Planned' },
            'not-implemented': { emoji: '❌', text: 'Not Implemented' },
            'informational-only': { emoji: 'ℹ️', text: 'Info Only' }
        };
        
        const badge = badges[status] || { emoji: '❓', text: status };
        return `<span class="status-badge ${status}">${badge.emoji} ${badge.text}</span>`;
    }
    
    // ============================================
    // LEARN MODE MANAGER
    // ============================================
    
    class LearnModeManager {
        constructor() {
            this.enabled = false;
            this.toggleButton = null;
            this.controlContainer = null;
            this.onStateChange = null;
        }
        
        /**
         * Initialize Learn Mode toggle
         */
        initialize() {
            this.toggleButton = document.getElementById('learnModeToggle');
            this.controlContainer = document.querySelector('.learn-mode-control');
            
            if (!this.toggleButton || !this.controlContainer) {
                console.warn('Learn Mode controls not found in DOM');
                return;
            }
            
            this.attachEventListeners();
            console.log('Learn Mode initialized');
        }
        
        /**
         * Attach event listeners
         */
        attachEventListeners() {
            // Toggle button click
            this.toggleButton.addEventListener('click', () => {
                this.toggle();
            });
            
            // Keyboard support
            this.toggleButton.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    this.toggle();
                }
            });
            
            // Intercept key clicks in capture phase when Learn Mode is enabled
            document.addEventListener('click', this.handleKeyClick.bind(this), true);
        }
        
        /**
         * Toggle Learn Mode on/off
         */
        toggle() {
            this.enabled = !this.enabled;
            this.updateUI();
            
            if (this.onStateChange) {
                this.onStateChange(this.enabled);
            }
            
            console.log('Learn Mode:', this.enabled ? 'ON' : 'OFF');
        }
        
        /**
         * Set Learn Mode state
         * @param {boolean} enabled - New state
         */
        setEnabled(enabled) {
            if (this.enabled !== enabled) {
                this.toggle();
            }
        }
        
        /**
         * Check if Learn Mode is enabled
         * @returns {boolean} Current state
         */
        isEnabled() {
            return this.enabled;
        }
        
        /**
         * Update UI to reflect current state
         */
        updateUI() {
            this.toggleButton.setAttribute('aria-checked', this.enabled);
            
            // Update state text
            const stateText = this.toggleButton.querySelector('.toggle-state-text');
            if (stateText) {
                stateText.textContent = this.enabled ? 'ON' : 'OFF';
            }
            
            // Update container class
            if (this.enabled) {
                this.controlContainer.classList.add('active');
                document.body.classList.add('learn-mode-active');
            } else {
                this.controlContainer.classList.remove('active');
                document.body.classList.remove('learn-mode-active');
            }
        }
        
        /**
         * Handle key button clicks (capture phase)
         * @param {Event} event - Click event
         */
        handleKeyClick(event) {
            // Only intercept if Learn Mode is enabled
            if (!this.enabled) {
                return;
            }
            
            // Check if click target is a key button
            const keyButton = event.target.closest('.key');
            if (!keyButton) {
                return;
            }
            
            // Intercept the click
            event.stopPropagation();
            event.preventDefault();
            
            // Get the key ID
            const dataKey = keyButton.dataset.key;
            if (!dataKey) {
                console.warn('Key button missing data-key attribute');
                return;
            }
            
            // Open detail page
            this.openKeyDetail(dataKey);
        }
        
        /**
         * Open key detail page
         * @param {string} dataKey - Key identifier
         */
        openKeyDetail(dataKey) {
            window.location.href = `docs/key-detail.html?key=${dataKey}`;
        }
    }
    
    // ============================================
    // TOOLTIP MANAGER
    // ============================================
    
    class TooltipManager {
        constructor() {
            this.tooltip = null;
            this.currentKey = null;
            this.showDelay = 300;
            this.showTimer = null;
        }
        
        /**
         * Initialize tooltip system
         */
        initialize() {
            this.createTooltip();
            this.attachKeyEventListeners();
            console.log('Tooltip system initialized');
        }
        
        /**
         * Create tooltip element
         */
        createTooltip() {
            this.tooltip = document.createElement('div');
            this.tooltip.className = 'key-tooltip';
            this.tooltip.setAttribute('role', 'tooltip');
            document.body.appendChild(this.tooltip);
        }
        
        /**
         * Attach event listeners to all key buttons
         */
        attachKeyEventListeners() {
            const keys = document.querySelectorAll('.key');
            
            keys.forEach(key => {
                // Mouse events
                key.addEventListener('mouseenter', (e) => {
                    this.scheduleShow(key);
                });
                
                key.addEventListener('mouseleave', () => {
                    this.cancelShow();
                    this.hide();
                });
                
                // Focus events
                key.addEventListener('focus', () => {
                    this.show(key);
                });
                
                key.addEventListener('blur', () => {
                    this.hide();
                });
            });
            
            // Hide on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.hide();
                }
            });
        }
        
        /**
         * Schedule tooltip show after delay
         * @param {HTMLElement} keyElement - Key button element
         */
        scheduleShow(keyElement) {
            this.cancelShow();
            this.showTimer = setTimeout(() => {
                this.show(keyElement);
            }, this.showDelay);
        }
        
        /**
         * Cancel scheduled tooltip show
         */
        cancelShow() {
            if (this.showTimer) {
                clearTimeout(this.showTimer);
                this.showTimer = null;
            }
        }
        
        /**
         * Show tooltip for a key
         * @param {HTMLElement} keyElement - Key button element
         */
        show(keyElement) {
            const dataKey = keyElement.dataset.key;
            if (!dataKey) return;
            
            const metadata = getKeyMetadata(dataKey);
            if (!metadata) {
                console.warn('No metadata found for key:', dataKey);
                return;
            }
            
            this.currentKey = keyElement;
            this.tooltip.innerHTML = this.generateTooltipContent(metadata);
            this.tooltip.classList.add('visible');
            this.position(keyElement);
        }
        
        /**
         * Hide tooltip
         */
        hide() {
            this.cancelShow();
            this.tooltip.classList.remove('visible');
            this.currentKey = null;
        }
        
        /**
         * Position tooltip relative to key
         * @param {HTMLElement} keyElement - Key button element
         */
        position(keyElement) {
            const keyRect = keyElement.getBoundingClientRect();
            const tooltipRect = this.tooltip.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            const margin = 8;
            
            let top, left;
            
            // Try above key
            if (keyRect.top - tooltipRect.height - margin > 0) {
                top = keyRect.top - tooltipRect.height - margin;
                left = keyRect.left + (keyRect.width - tooltipRect.width) / 2;
            }
            // Try below key
            else if (keyRect.bottom + tooltipRect.height + margin < viewportHeight) {
                top = keyRect.bottom + margin;
                left = keyRect.left + (keyRect.width - tooltipRect.width) / 2;
            }
            // Fallback: center on screen
            else {
                top = viewportHeight / 2 - tooltipRect.height / 2;
                left = viewportWidth / 2 - tooltipRect.width / 2;
            }
            
            // Clamp to viewport
            left = Math.max(margin, Math.min(left, viewportWidth - tooltipRect.width - margin));
            top = Math.max(margin, Math.min(top, viewportHeight - tooltipRect.height - margin));
            
            this.tooltip.style.top = `${top}px`;
            this.tooltip.style.left = `${left}px`;
        }
        
        /**
         * Generate tooltip HTML content
         * @param {object} metadata - Key metadata
         * @returns {string} HTML content
         */
        generateTooltipContent(metadata) {
            let html = `
                <div class="tooltip-header">
                    <span class="tooltip-key-label">${metadata.label}</span>
                    <span class="tooltip-display-name">${metadata.displayName}</span>
                </div>
                <div class="tooltip-body">
                    <div class="tooltip-category">
                        <strong>Category:</strong> ${metadata.category}
                    </div>
                    <div class="tooltip-primary">
                        <strong>Primary:</strong> ${metadata.shortDescription}
                    </div>
            `;
            
            // Add gold functions
            if (metadata.shiftedFunctions.gold && metadata.shiftedFunctions.gold.length > 0) {
                const goldFuncs = metadata.shiftedFunctions.gold.map(f => 
                    `${f.label} (${f.implementationStatus})`
                ).join(', ');
                html += `
                    <div class="tooltip-shifted gold">
                        <strong>Gold:</strong> ${goldFuncs}
                    </div>
                `;
            }
            
            // Add blue functions
            if (metadata.shiftedFunctions.blue && metadata.shiftedFunctions.blue.length > 0) {
                const blueFuncs = metadata.shiftedFunctions.blue.map(f => 
                    `${f.label} (${f.implementationStatus})`
                ).join(', ');
                html += `
                    <div class="tooltip-shifted blue">
                        <strong>Blue:</strong> ${blueFuncs}
                    </div>
                `;
            }
            
            html += `
                </div>
                <div class="tooltip-footer">
                    ${getStatusBadge(metadata.implementation.status)}
                    <span class="tooltip-hint">Click for details</span>
                </div>
            `;
            
            return html;
        }
    }
    
    // ============================================
    // INITIALIZATION
    // ============================================
    
    let learnMode = null;
    let tooltipManager = null;
    
    /**
     * Initialize educational layer
     */
    function initializeEducationalLayer() {
        console.log('Initializing educational layer...');
        
        // Initialize Learn Mode
        learnMode = new LearnModeManager();
        learnMode.initialize();
        
        // Initialize Tooltips
        tooltipManager = new TooltipManager();
        tooltipManager.initialize();
        
        console.log('Educational layer ready');
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeEducationalLayer);
    } else {
        initializeEducationalLayer();
    }
    
    // Export to window for debugging
    window.HP12C_EDUCATIONAL = {
        learnMode,
        tooltipManager,
        getKeyMetadata,
        getStatusBadge
    };
    
})();
