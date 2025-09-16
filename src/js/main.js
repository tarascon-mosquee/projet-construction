/* 
 * Main JS - Point d'entrée principal
 * Initialise tous les modules et gère les fonctionnalités globales
 */

(function() {
    'use strict';
    
    // Configuration globale
    const CONFIG = {
        scrollOffset: 80,
        debounceDelay: 10,
        animationDuration: 300
    };
    
    // État global de l'application
    const AppState = {
        isLoaded: false,
        isMobile: window.innerWidth < 768,
        scrollPosition: 0,
        activeSection: 'accueil'
    };
    
    // Initialisation principale
    function init() {
        // Attendre que le DOM soit chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', handleDOMReady);
        } else {
            handleDOMReady();
        }
        
        // Event listeners globaux
        setupGlobalEventListeners();
        
        // Vérifications de compatibilité
        checkBrowserCompatibility();
    }
    
    // Gestion du DOM prêt
    function handleDOMReady() {
        AppState.isLoaded = true;
        
        // Initialiser les modules
        initializeModules();
        
        // Performance et optimisations
        setupPerformanceOptimizations();
        
        // Accessibilité
        setupAccessibility();
        
        // Analytics et tracking (si nécessaire)
        setupAnalytics();
        
        // Animation d'entrée
        animatePageEntry();
        
        console.log('✅ Site Mosquée de Tarascon initialisé');
    }
    
    // Initialiser tous les modules
    function initializeModules() {
        // Les modules sont déjà initialisés dans leurs fichiers respectifs
        // On peut ici vérifier leur disponibilité
        
        const modules = ['MenuModule', 'GalleryModule', 'CounterModule'];
        modules.forEach(moduleName => {
            if (window[moduleName]) {
                console.log(`✅ Module ${moduleName} chargé`);
            } else {
                console.warn(`⚠️ Module ${moduleName} non disponible`);
            }
        });
    }
    
    // Event listeners globaux
    function setupGlobalEventListeners() {
        // Gestion du redimensionnement
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleResize, CONFIG.debounceDelay);
        });
        
        // Gestion du scroll global
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            AppState.scrollPosition = window.pageYOffset;
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateScrollState, CONFIG.debounceDelay);
        });
        
        // Gestion de l'orientation mobile
        window.addEventListener('orientationchange', () => {
            setTimeout(handleOrientationChange, 100);
        });
        
        // Gestion de la visibilité de la page
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Gestion des erreurs globales
        window.addEventListener('error', handleGlobalError);
    }
    
    // Gestion du redimensionnement
    function handleResize() {
        const wasMobile = AppState.isMobile;
        AppState.isMobile = window.innerWidth < 768;
        
        // Actions spécifiques au changement mobile/desktop
        if (wasMobile !== AppState.isMobile) {
            handleDeviceChange();
        }
        
        // Recalculer les hauteurs si nécessaire
        updateViewportHeight();
    }
    
    // Changement de device (mobile <-> desktop)
    function handleDeviceChange() {
        // Fermer le menu mobile si on passe en desktop
        if (!AppState.isMobile && window.MenuModule) {
            window.MenuModule.closeMenu();
        }
        
        console.log(`📱 Changement de device: ${AppState.isMobile ? 'Mobile' : 'Desktop'}`);
    }
    
    // Mise à jour de l'état du scroll
    function updateScrollState() {
        // Mettre à jour la section active
        updateActiveSection();
        
        // Autres actions liées au scroll...
    }
    
    // Mise à jour de la section active
    function updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = AppState.scrollPosition + CONFIG.scrollOffset + 50;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                const newActiveSection = section.id;
                if (newActiveSection !== AppState.activeSection) {
                    AppState.activeSection = newActiveSection;
                    updateSectionIndicators(newActiveSection);
                }
            }
        });
    }
    
    // Mise à jour des indicateurs de section
    function updateSectionIndicators(activeSection) {
        // Mettre à jour les liens de navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${activeSection}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Gestion du changement d'orientation
    function handleOrientationChange() {
        // Recalculer les dimensions
        updateViewportHeight();
        
        // Forcer un redraw pour corriger les bugs d'affichage
        document.body.style.display = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.display = '';
    }
    
    // Mise à jour de la hauteur du viewport (pour mobile)
    function updateViewportHeight() {
        // Corriger les problèmes de 100vh sur mobile
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // Gestion de la visibilité de la page
    function handleVisibilityChange() {
        if (document.hidden) {
            // Page cachée - pause des animations coûteuses
            pauseAnimations();
        } else {
            // Page visible - reprendre les animations
            resumeAnimations();
        }
    }
    
    // Pause des animations
    function pauseAnimations() {
        document.body.classList.add('animations-paused');
    }
    
    // Reprise des animations
    function resumeAnimations() {
        document.body.classList.remove('animations-paused');
    }
    
    // Optimisations de performance
    function setupPerformanceOptimizations() {
        // Lazy loading des images (déjà géré dans gallery.js)
        
        // Préconnexion aux domaines externes
        addPreconnectLinks();
        
        // Optimisation des fonts
        optimizeFonts();
        
        // Service Worker (si nécessaire)
        // registerServiceWorker();
    }
    
    // Ajouter des liens de préconnexion
    function addPreconnectLinks() {
        const preconnects = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://images.pexels.com'
        ];
        
        preconnects.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = url;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }
    
    // Optimisation des polices
    function optimizeFonts() {
        // Précharger les polices critiques
        const fontPreloads = [
            {
                href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
                as: 'style'
            }
        ];
        
        fontPreloads.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = font.href;
            link.as = font.as;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }
    
    // Configuration de l'accessibilité
    function setupAccessibility() {
        // Skip links pour la navigation au clavier
        addSkipLinks();
        
        // Amélioration du focus
        setupFocusManagement();
        
        // Annonces pour les lecteurs d'écran
        setupScreenReaderAnnouncements();
    }
    
    // Ajouter des liens de saut
    function addSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Aller au contenu principal';
        skipLink.className = 'skip-link sr-only';
        skipLink.style.cssText = `
            position: fixed;
            top: -40px;
            left: 6px;
            background: var(--primary);
            color: white;
            padding: 8px;
            z-index: 1000;
            text-decoration: none;
            border-radius: 4px;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    // Gestion du focus
    function setupFocusManagement() {
        // Gérer le focus après les transitions
        document.addEventListener('transitionend', (e) => {
            if (e.target.matches('.lightbox')) {
                e.target.focus();
            }
        });
    }
    
    // Annonces pour lecteurs d'écran
    function setupScreenReaderAnnouncements() {
        const announcer = document.createElement('div');
        announcer.id = 'screen-reader-announcements';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        document.body.appendChild(announcer);
        
        // Fonction globale pour faire des annonces
        window.announceToScreenReader = (message) => {
            announcer.textContent = message;
            setTimeout(() => {
                announcer.textContent = '';
            }, 1000);
        };
    }
    
    // Configuration des analytics (préparation)
    function setupAnalytics() {
        // Placeholder pour Google Analytics ou autre
        // En respectant le RGPD et les préférences de l'utilisateur
        
        if (shouldTrackUser()) {
            // initializeGoogleAnalytics();
            // trackPageView();
        }
    }
    
    // Vérifier si on doit tracker l'utilisateur
    function shouldTrackUser() {
        // Vérifier les préférences de cookies/tracking
        return false; // Désactivé par défaut
    }
    
    // Animation d'entrée de la page
    function animatePageEntry() {
        document.body.classList.add('page-loaded');
        
        // Animer les éléments principaux
        const elementsToAnimate = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description');
        elementsToAnimate.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.2}s`;
            el.classList.add('slide-up');
        });
    }
    
    // Vérification de compatibilité navigateur
    function checkBrowserCompatibility() {
        const features = {
            intersectionObserver: 'IntersectionObserver' in window,
            cssCustomProperties: CSS.supports('color', 'var(--fake-var)'),
            flexbox: CSS.supports('display', 'flex'),
            grid: CSS.supports('display', 'grid')
        };
        
        const missingFeatures = Object.keys(features).filter(feature => !features[feature]);
        
        if (missingFeatures.length > 0) {
            console.warn('⚠️ Fonctionnalités non supportées:', missingFeatures);
            // Charger des polyfills si nécessaire
            loadPolyfills(missingFeatures);
        }
    }
    
    // Chargement des polyfills
    function loadPolyfills(missingFeatures) {
        // Intersection Observer polyfill
        if (missingFeatures.includes('intersectionObserver')) {
            const script = document.createElement('script');
            script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
            document.head.appendChild(script);
        }
    }
    
    // Gestion des erreurs globales
    function handleGlobalError(error) {
        console.error('❌ Erreur globale:', error);
        
        // En production, envoyer l'erreur à un service de monitoring
        if (window.location.hostname !== 'localhost') {
            // sendErrorToMonitoringService(error);
        }
    }
    
    // Utilitaires globaux
    window.AppUtils = {
        getState: () => ({ ...AppState }),
        announceToScreenReader: window.announceToScreenReader,
        smoothScrollTo: (target) => {
            if (window.MenuModule) {
                window.MenuModule.smoothScrollTo(target);
            }
        }
    };
    
    // Debug en développement
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.AppState = AppState;
        window.CONFIG = CONFIG;
        console.log('🔧 Mode développement activé');
    }
    
    // Démarrer l'application
    init();
    
})();