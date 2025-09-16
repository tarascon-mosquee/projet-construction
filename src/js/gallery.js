/* 
 * Gallery JS - Gestion de la galerie photo avec lightbox
 * Lightbox natif, lazy loading et navigation clavier
 */

(function() {
    'use strict';
    
    // Variables de la galerie
    const gallery = document.getElementById('gallery');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    let currentImageIndex = 0;
    let galleryImages = [];
    
    // Initialiser la galerie
    function initGallery() {
        if (!gallery) return;
        
        // Récupérer toutes les images de la galerie
        galleryImages = Array.from(gallery.querySelectorAll('.gallery-item img'));
        
        // Ajouter les event listeners
        galleryImages.forEach((img, index) => {
            // Lazy loading
            setupLazyLoading(img);
            
            // Click pour ouvrir la lightbox
            img.parentElement.addEventListener('click', () => {
                openLightbox(index);
            });
            
            // Accessibilité
            img.parentElement.setAttribute('role', 'button');
            img.parentElement.setAttribute('tabindex', '0');
            img.parentElement.setAttribute('aria-label', `Ouvrir l'image ${index + 1} en grand`);
            
            // Navigation clavier sur les éléments de galerie
            img.parentElement.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(index);
                }
            });
        });
    }
    
    // Configuration du lazy loading
    function setupLazyLoading(img) {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        lazyImage.addEventListener('load', () => {
                            lazyImage.classList.add('loaded');
                            // Animation d'apparition
                            lazyImage.style.opacity = '1';
                        });
                        observer.unobserve(lazyImage);
                    }
                });
            });
            
            imageObserver.observe(img);
        } else {
            // Fallback pour les navigateurs plus anciens
            img.classList.add('loaded');
        }
    }
    
    // Ouvrir la lightbox
    function openLightbox(index) {
        currentImageIndex = index;
        const img = galleryImages[index];
        const fullSrc = img.getAttribute('data-full') || img.src;
        const alt = img.alt;
        
        // Mettre à jour l'image de la lightbox
        lightboxImage.src = fullSrc;
        lightboxImage.alt = alt;
        
        // Afficher la lightbox
        lightbox.classList.add('active');
        lightbox.style.display = 'flex';
        
        // Bloquer le scroll du body
        document.body.style.overflow = 'hidden';
        
        // Focus pour l'accessibilité
        lightbox.focus();
        
        // Précharger les images adjacentes
        preloadAdjacentImages();
    }
    
    // Fermer la lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        
        // Animation de fermeture
        setTimeout(() => {
            lightbox.style.display = 'none';
            lightboxImage.src = '';
        }, 300);
        
        // Restaurer le scroll
        document.body.style.overflow = '';
        
        // Remettre le focus sur l'image de la galerie
        const currentGalleryItem = galleryImages[currentImageIndex].parentElement;
        if (currentGalleryItem) {
            currentGalleryItem.focus();
        }
    }
    
    // Navigation vers l'image suivante
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateLightboxImage();
    }
    
    // Navigation vers l'image précédente
    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxImage();
    }
    
    // Mettre à jour l'image de la lightbox
    function updateLightboxImage() {
        const img = galleryImages[currentImageIndex];
        const fullSrc = img.getAttribute('data-full') || img.src;
        const alt = img.alt;
        
        // Animation de transition
        lightboxImage.style.opacity = '0';
        
        setTimeout(() => {
            lightboxImage.src = fullSrc;
            lightboxImage.alt = alt;
            lightboxImage.style.opacity = '1';
        }, 150);
        
        preloadAdjacentImages();
    }
    
    // Précharger les images adjacentes pour une navigation fluide
    function preloadAdjacentImages() {
        const preloadIndexes = [
            (currentImageIndex - 1 + galleryImages.length) % galleryImages.length,
            (currentImageIndex + 1) % galleryImages.length
        ];
        
        preloadIndexes.forEach(index => {
            const img = galleryImages[index];
            const fullSrc = img.getAttribute('data-full') || img.src;
            
            // Créer une image pour le préchargement
            const preloadImg = new Image();
            preloadImg.src = fullSrc;
        });
    }
    
    // Event listeners pour la lightbox
    function setupLightboxEvents() {
        if (!lightbox) return;
        
        // Bouton de fermeture
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }
        
        // Clic sur le fond pour fermer
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Navigation clavier
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    prevImage();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    nextImage();
                    break;
            }
        });
        
        // Support du swipe sur mobile
        let startX = 0;
        let startY = 0;
        
        lightbox.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        lightbox.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Vérifier que c'est bien un swipe horizontal
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    nextImage(); // Swipe left = image suivante
                } else {
                    prevImage(); // Swipe right = image précédente
                }
            }
            
            startX = 0;
            startY = 0;
        });
    }
    
    // Gestion des erreurs de chargement d'image
    function handleImageError(img) {
        img.addEventListener('error', () => {
            img.style.opacity = '0.5';
            img.alt = 'Erreur de chargement de l\'image';
            
            // Ajouter un indicateur d'erreur
            const errorDiv = document.createElement('div');
            errorDiv.textContent = 'Image non disponible';
            errorDiv.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.7);
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 14px;
            `;
            
            img.parentElement.style.position = 'relative';
            img.parentElement.appendChild(errorDiv);
        });
    }
    
    // Initialisation
    document.addEventListener('DOMContentLoaded', () => {
        initGallery();
        setupLightboxEvents();
        
        // Gestion des erreurs pour toutes les images
        galleryImages.forEach(handleImageError);
    });
    
    // Export pour les tests
    window.GalleryModule = {
        openLightbox,
        closeLightbox,
        nextImage,
        prevImage,
        galleryImages: () => galleryImages
    };
    
})();