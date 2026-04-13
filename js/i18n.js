/**
 * HP-12C I18n System
 * Bilingual support (English/German)
 */

(function() {
    'use strict';
    
    const translations = {
        en: {
            // Navigation
            examples: '📚 Examples & Tutorials',
            
            // Learn Mode
            learnMode: 'Learn Mode',
            learnModeToggleAria: 'Toggle Learn Mode - Enable to click keys for detailed information',
            off: 'OFF',
            on: 'ON',
            hoverHint: 'Hover any key for quick info',
            clickHint: '✨ Click any key to see detailed information',
            exploreHint: '💡 Toggle ON to explore key functions interactively',
            
            // Modal
            keyDetails: 'Key Details',
            close: 'Close',
            loading: 'Loading key information...',
            description: 'Description',
            functions: 'Functions',
            technicalDetails: 'Technical Details',
            primaryFunction: 'Primary Function',
            goldFunction: '🟡 Gold (f ',
            blueFunction: '🔵 Blue (g ',
            examples: 'Examples:',
            dataKey: 'Data Key:',
            category: 'Category:',
            status: 'Status:',
            implementationNote: 'Implementation Note:',
            
            // Status Badges
            implemented: '✅ Implemented',
            partiallyImplemented: '⚙️ Partially',
            planned: '📋 Planned',
            notImplemented: '❌ Not Implemented',
            informationalOnly: 'ℹ️ Info Only',
            
            // Categories
            'numeric-entry': '🔢 Numeric Entry',
            'arithmetic': '➕ Arithmetic',
            'stack': '📚 Stack Operations',
            'prefix': '🔤 Prefix Keys',
            'control': '⚙️ Control',
            'financial': '💰 Financial',
            'memory': '💾 Memory',
            'percentage': '％ Percentage',
            'power-log': '📐 Power & Logarithms',
            'programming': '⌨️ Programming',
            'statistics': '📊 Statistics',
            'date': '📅 Date Functions'
        },
        de: {
            // Navigation
            examples: '📚 Beispiele & Tutorials',
            
            // Learn Mode
            learnMode: 'Lernmodus',
            learnModeToggleAria: 'Lernmodus umschalten - Aktivieren um Tasten für Details anzuklicken',
            off: 'AUS',
            on: 'EIN',
            hoverHint: 'Taste überfahren für Kurzinfo',
            clickHint: '✨ Taste anklicken für detaillierte Informationen',
            exploreHint: '💡 Schalten Sie EIN um Tastenfunktionen interaktiv zu erkunden',
            
            // Modal
            keyDetails: 'Tastendetails',
            close: 'Schließen',
            loading: 'Lade Tasteninformationen...',
            description: 'Beschreibung',
            functions: 'Funktionen',
            technicalDetails: 'Technische Details',
            primaryFunction: 'Hauptfunktion',
            goldFunction: '🟡 Gold (f ',
            blueFunction: '🔵 Blau (g ',
            examples: 'Beispiele:',
            dataKey: 'Datenschlüssel:',
            category: 'Kategorie:',
            status: 'Status:',
            implementationNote: 'Implementierungshinweis:',
            
            // Status Badges
            implemented: '✅ Implementiert',
            partiallyImplemented: '⚙️ Teilweise',
            planned: '📋 Geplant',
            notImplemented: '❌ Nicht Implementiert',
            informationalOnly: 'ℹ️ Nur Info',
            
            // Categories
            'numeric-entry': '🔢 Zahleneingabe',
            'arithmetic': '➕ Arithmetik',
            'stack': '📚 Stack-Operationen',
            'prefix': '🔤 Präfix-Tasten',
            'control': '⚙️ Steuerung',
            'financial': '💰 Finanzen',
            'memory': '💾 Speicher',
            'percentage': '％ Prozent',
            'power-log': '📐 Potenzen & Logarithmen',
            'programming': '⌨️ Programmierung',
            'statistics': '📊 Statistik',
            'date': '📅 Datumsfunktionen'
        }
    };
    
    class I18n {
        constructor() {
            this.currentLang = this.loadLanguage();
            this.translations = translations;
        }
        
        /**
         * Load language from localStorage or browser default
         * @returns {string} Language code (en or de)
         */
        loadLanguage() {
            const stored = localStorage.getItem('hp12c-lang');
            if (stored && (stored === 'en' || stored === 'de')) {
                return stored;
            }
            
            // Detect browser language
            const browserLang = navigator.language || navigator.userLanguage;
            return browserLang.startsWith('de') ? 'de' : 'en';
        }
        
        /**
         * Save language preference
         * @param {string} lang - Language code
         */
        saveLanguage(lang) {
            localStorage.setItem('hp12c-lang', lang);
            this.currentLang = lang;
        }
        
        /**
         * Get translation for key
         * @param {string} key - Translation key
         * @returns {string} Translated text
         */
        t(key) {
            return this.translations[this.currentLang][key] || 
                   this.translations.en[key] || 
                   key;
        }
        
        /**
         * Get current language
         * @returns {string} Language code
         */
        getLang() {
            return this.currentLang;
        }
        
        /**
         * Set language
         * @param {string} lang - Language code
         */
        setLang(lang) {
            if (lang !== 'en' && lang !== 'de') {
                console.warn('Unsupported language:', lang);
                return;
            }
            
            this.saveLanguage(lang);
            this.updateUI();
        }
        
        /**
         * Toggle between languages
         */
        toggleLang() {
            const newLang = this.currentLang === 'en' ? 'de' : 'en';
            this.setLang(newLang);
        }
        
        /**
         * Update all UI text elements
         */
        updateUI() {
            // Update elements with data-i18n attribute
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                element.textContent = this.t(key);
            });
            
            // Update ARIA labels
            document.querySelectorAll('[data-i18n-aria]').forEach(element => {
                const key = element.getAttribute('data-i18n-aria');
                element.setAttribute('aria-label', this.t(key));
            });
            
            // Update toggle state text if learn mode is active
            const toggleText = document.querySelector('.toggle-state-text');
            if (toggleText) {
                const learnMode = window.HP12C_EDUCATIONAL && 
                                 window.HP12C_EDUCATIONAL.learnMode;
                if (learnMode) {
                    const isOn = learnMode.isEnabled();
                    toggleText.textContent = this.t(isOn ? 'on' : 'off');
                }
            }
            
            // Trigger custom event for other components
            document.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { lang: this.currentLang }
            }));
        }
        
        /**
         * Initialize i18n system
         */
        initialize() {
            console.log('I18n initialized, current language:', this.currentLang);
            
            // Setup language toggle button
            const toggleBtn = document.getElementById('languageToggle');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => this.toggleLang());
                
                // Update button text
                const updateButtonText = () => {
                    const otherLang = this.currentLang === 'en' ? 'DE' : 'EN';
                    toggleBtn.innerHTML = `🌐 ${otherLang}`;
                    toggleBtn.title = this.currentLang === 'en' ? 
                        'Zu Deutsch wechseln' : 'Switch to English';
                };
                updateButtonText();
                
                // Listen for language changes
                document.addEventListener('languageChanged', updateButtonText);
            }
            
            // Apply initial translations
            this.updateUI();
        }
    }
    
    // Create global instance
    window.HP12C_I18N = new I18n();
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.HP12C_I18N.initialize();
        });
    } else {
        window.HP12C_I18N.initialize();
    }
    
})();
