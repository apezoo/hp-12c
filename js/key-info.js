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
            
            // Update state text with translation
            const stateText = this.toggleButton.querySelector('.toggle-state-text');
            if (stateText) {
                const i18n = window.HP12C_I18N;
                const key = this.enabled ? 'on' : 'off';
                stateText.textContent = i18n ? i18n.t(key) : (this.enabled ? 'ON' : 'OFF');
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
            
            // Intercept the click - stop it from reaching other handlers
            event.stopPropagation();
            event.preventDefault();
            event.stopImmediatePropagation(); // Prevent other listeners on the same element
            
            // Get the key ID
            const dataKey = keyButton.dataset.key;
            if (!dataKey) {
                console.warn('Key button missing data-key attribute');
                return;
            }
            
            console.log('Learn Mode: Opening detail page for key:', dataKey);
            
            // Open detail page
            this.openKeyDetail(dataKey);
        }
        
        /**
         * Open key detail modal
         * @param {string} dataKey - Key identifier
         */
        openKeyDetail(dataKey) {
            console.log('Learn Mode: Opening modal for key:', dataKey);
            
            // Get metadata
            const metadata = getKeyMetadata(dataKey);
            if (!metadata) {
                console.warn('No metadata found for key:', dataKey);
                return;
            }
            
            // Show modal
            this.showModal(dataKey, metadata);
        }
        
        /**
         * Show modal with key details
         * @param {string} keyId - Key identifier
         * @param {object} metadata - Key metadata
         */
        showModal(keyId, metadata) {
            const modal = document.getElementById('keyDetailModal');
            const modalContent = document.getElementById('modalContent');
            const modalTitle = document.getElementById('modalTitle');
            
            if (!modal || !modalContent || !modalTitle) {
                console.error('Modal elements not found in DOM');
                return;
            }
            
            // Set title - keep the key's actual name, just translate the modal header
            modalTitle.textContent = metadata.displayName;
            
            // Generate content
            modalContent.innerHTML = this.generateModalContent(keyId, metadata);
            
            // Show modal
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Setup close handlers
            this.setupModalHandlers(modal);
        }
        
        /**
         * Setup modal event handlers
         * @param {HTMLElement} modal - Modal element
         */
        setupModalHandlers(modal) {
            // Close button
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.onclick = () => this.closeModal();
            }
            
            // Overlay click
            const overlay = modal.querySelector('.modal-overlay');
            if (overlay) {
                overlay.onclick = () => this.closeModal();
            }
            
            // Escape key
            const escapeHandler = (e) => {
                if (e.key === 'Escape') {
                    this.closeModal();
                    document.removeEventListener('keydown', escapeHandler);
                }
            };
            document.addEventListener('keydown', escapeHandler);
        }
        
        /**
         * Close modal
         */
        closeModal() {
            const modal = document.getElementById('keyDetailModal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        }
        
        /**
         * Generate modal HTML content
         * @param {string} keyId - Key identifier
         * @param {object} metadata - Key metadata
         * @returns {string} HTML content
         */
        generateModalContent(keyId, metadata) {
            const i18n = window.HP12C_I18N;
            const t = i18n ? (key) => i18n.t(key) : (key) => key;
            
            let html = '';
            
            // Status badge
            if (metadata.implementation) {
                html += `<div>${getStatusBadge(metadata.implementation.status)}</div>`;
            }
            
            // Key visual
            html += `
                <div class="modal-key-visual">
                    <div class="modal-key-label">${metadata.label}</div>
                    <div class="modal-key-name">${metadata.displayName}</div>
                    ${this.generateSublabels(metadata)}
                </div>
            `;
            
            // Description
            if (metadata.shortDescription) {
                html += `
                    <div class="modal-section">
                        <h2 class="modal-section-title">
                            <span>📝</span>
                            <span>${t('description')}</span>
                        </h2>
                        <p style="font-size: 1.1rem; line-height: 1.6; color: #4a5568;">${metadata.shortDescription}</p>
                        ${metadata.longDescription ? `<p style="margin-top: 1rem; line-height: 1.6; color: #4a5568;">${metadata.longDescription}</p>` : ''}
                    </div>
                `;
            }
            
            // Functions
            html += `
                <div class="modal-section">
                    <h2 class="modal-section-title">
                        <span>📖</span>
                        <span>${t('functions')}</span>
                    </h2>
                    <div class="modal-function-grid">
                        ${this.generateFunctions(metadata)}
                    </div>
                </div>
            `;
            
            // Technical details
            html += `
                <div class="modal-section">
                    <h2 class="modal-section-title">
                        <span>ℹ️</span>
                        <span>${t('technicalDetails')}</span>
                    </h2>
                    <ul class="modal-details-list">
                        <li>
                            <span class="modal-details-label">${t('dataKey')}</span>
                            <span class="modal-details-value">${keyId}</span>
                        </li>
                        <li>
                            <span class="modal-details-label">${t('category')}</span>
                            <span class="modal-details-value">${t(metadata.category)}</span>
                        </li>
                        ${metadata.implementation ? `
                            <li>
                                <span class="modal-details-label">${t('status')}</span>
                                <span class="modal-details-value">${metadata.implementation.status}</span>
                            </li>
                            ${metadata.implementation.note ? `
                            <li>
                                <span class="modal-details-label">${t('implementationNote')}</span>
                                <span class="modal-details-value">${metadata.implementation.note}</span>
                            </li>
                            ` : ''}
                        ` : ''}
                    </ul>
                </div>
            `;
            
            return html;
        }
        
        /**
         * Generate sublabels HTML
         * @param {object} metadata - Key metadata
         * @returns {string} HTML for sublabels
         */
        generateSublabels(metadata) {
            if (!metadata.shiftedFunctions ||
                (!metadata.shiftedFunctions.gold && !metadata.shiftedFunctions.blue)) {
                return '';
            }
            
            let html = '<div class="modal-key-sublabels">';
            
            if (metadata.shiftedFunctions.gold) {
                const labels = metadata.shiftedFunctions.gold.map(f => f.label).join(', ');
                html += `
                    <div class="modal-key-sublabel">
                        <div class="modal-key-sublabel-type">Gold (f)</div>
                        <div class="modal-key-sublabel-text">${labels}</div>
                    </div>
                `;
            }
            
            if (metadata.shiftedFunctions.blue) {
                const labels = metadata.shiftedFunctions.blue.map(f => f.label).join(', ');
                html += `
                    <div class="modal-key-sublabel">
                        <div class="modal-key-sublabel-type">Blue (g)</div>
                        <div class="modal-key-sublabel-text">${labels}</div>
                    </div>
                `;
            }
            
            html += '</div>';
            return html;
        }
        
        /**
         * Generate functions HTML
         * @param {object} metadata - Key metadata
         * @returns {string} HTML for functions
         */
        generateFunctions(metadata) {
            const i18n = window.HP12C_I18N;
            const t = i18n ? (key) => i18n.t(key) : (key) => key;
            
            let html = '';
            
            // Primary function
            if (metadata.primaryFunction) {
                html += `
                    <div class="modal-function-card">
                        <div class="modal-function-header">
                            <span class="modal-function-type primary">${t('primaryFunction')}</span>
                        </div>
                        <div class="modal-function-name">${metadata.primaryFunction.title}</div>
                        <div class="modal-function-description">${metadata.primaryFunction.description}</div>
                        ${this.generateExamples(metadata.primaryFunction.examples)}
                    </div>
                `;
            }
            
            // Gold functions
            if (metadata.shiftedFunctions && metadata.shiftedFunctions.gold) {
                metadata.shiftedFunctions.gold.forEach(func => {
                    html += `
                        <div class="modal-function-card">
                            <div class="modal-function-header">
                                <span class="modal-function-type gold">${t('goldFunction')}${metadata.label})</span>
                                ${getStatusBadge(func.implementationStatus || 'not-implemented')}
                            </div>
                            <div class="modal-function-name">${func.title}</div>
                            <div class="modal-function-description">${func.description}</div>
                            ${this.generateExamples(func.examples)}
                        </div>
                    `;
                });
            }
            
            // Blue functions
            if (metadata.shiftedFunctions && metadata.shiftedFunctions.blue) {
                metadata.shiftedFunctions.blue.forEach(func => {
                    html += `
                        <div class="modal-function-card">
                            <div class="modal-function-header">
                                <span class="modal-function-type blue">${t('blueFunction')}${metadata.label})</span>
                                ${getStatusBadge(func.implementationStatus || 'not-implemented')}
                            </div>
                            <div class="modal-function-name">${func.title}</div>
                            <div class="modal-function-description">${func.description}</div>
                            ${this.generateExamples(func.examples)}
                        </div>
                    `;
                });
            }
            
            return html;
        }
        
        /**
         * Generate examples HTML
         * @param {array} examples - Array of example strings
         * @returns {string} HTML for examples
         */
        generateExamples(examples) {
            if (!examples || examples.length === 0) {
                return '';
            }
            
            const i18n = window.HP12C_I18N;
            const t = i18n ? (key) => i18n.t(key) : (key) => key;
            
            return `
                <div class="modal-function-examples">
                    <strong>${t('examples')}</strong>
                    <ul>
                        ${examples.map(ex => `<li>${ex}</li>`).join('')}
                    </ul>
                </div>
            `;
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
