'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface UnsplashBrowserProps {
  textarea: HTMLTextAreaElement;
  onClose: () => void;
  settings?: {
    apiKey?: string;
    imageSize?: string;
    includeAttribution?: boolean;
  };
  extensionName?: string;
  extensionId?: string;
}

interface UnsplashImage {
  id: string;
  urls: {
    thumb: string;
    small: string;
    regular: string;
    full: string;
    raw: string;
  };
  alt_description: string | null;
  user: {
    name: string;
    username: string;
    links: {
      html: string;
    };
  };
  links: {
    html: string;
  };
}

// In-memory cache for settings to avoid repeated API calls within the same session
let settingsCache: { [key: string]: any } = {};

export function UnsplashBrowser({ textarea, onClose, settings, extensionName, extensionId }: UnsplashBrowserProps) {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedSettings, setFetchedSettings] = useState<typeof settings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  console.log('[UnsplashBrowser] Props:', { settings, extensionName, extensionId });

  // Fetch settings from API if not provided
  useEffect(() => {
    console.log('[UnsplashBrowser] useEffect check:', {
      hasSettings: !!settings,
      hasApiKey: !!settings?.apiKey,
      extensionId,
      extensionName,
      shouldFetch: (!settings || !settings.apiKey) && (!!extensionId || !!extensionName)
    });

    // If settings are already provided with API key, use them immediately
    if (settings?.apiKey) {
      console.log('[UnsplashBrowser] Using provided settings');
      setLoadingSettings(false);
      return;
    }

    // Check cache first
    const cacheKey = extensionId || extensionName || '';
    if (cacheKey && settingsCache[cacheKey]) {
      console.log('[UnsplashBrowser] Using cached settings');
      setFetchedSettings(settingsCache[cacheKey]);
      setLoadingSettings(false);
      return;
    }

    if ((!settings || !settings.apiKey)) {
      // If we have extensionId, use it directly
      if (extensionId) {
        console.log('[UnsplashBrowser] Fetching settings using extensionId:', extensionId);
        setLoadingSettings(true);
        fetch(`/api/extensions/${extensionId}/settings`)
          .then(res => {
            console.log('[UnsplashBrowser] Settings response status:', res.status);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          })
          .then(data => {
            console.log('[UnsplashBrowser] Fetched settings:', data);
            const fetchedData = data.settings || data;
            setFetchedSettings(fetchedData);
            // Cache the settings
            if (cacheKey) settingsCache[cacheKey] = fetchedData;
          })
          .catch(err => console.error('[UnsplashBrowser] Failed to fetch extension settings:', err))
          .finally(() => setLoadingSettings(false));
      }
      // Otherwise, if we have extensionName, look up the ID first
      else if (extensionName) {
        console.log('[UnsplashBrowser] Looking up extension ID by name:', extensionName);
        setLoadingSettings(true);
        fetch('/api/extensions/list')
          .then(res => {
            console.log('[UnsplashBrowser] Extension list response status:', res.status);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          })
          .then(extensions => {
            console.log('[UnsplashBrowser] Extension list:', extensions);
            const extension = extensions.find((ext: any) => ext.name === extensionName);
            console.log('[UnsplashBrowser] Found extension:', extension);
            if (extension?.id) {
              return fetch(`/api/extensions/${extension.id}/settings`);
            }
            throw new Error('Extension not found');
          })
          .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          })
          .then(data => {
            console.log('[UnsplashBrowser] Fetched settings:', data);
            const fetchedData = data.settings || data;
            setFetchedSettings(fetchedData);
            // Cache the settings
            if (cacheKey) settingsCache[cacheKey] = fetchedData;
          })
          .catch(err => console.error('[UnsplashBrowser] Failed to fetch extension settings:', err))
          .finally(() => setLoadingSettings(false));
      } else {
        // No way to fetch settings
        setLoadingSettings(false);
      }
    }
  }, [settings, extensionId, extensionName]);

  const effectiveSettings = settings?.apiKey ? settings : fetchedSettings;
  const imageSize = effectiveSettings?.imageSize || '800';
  const includeAttribution = effectiveSettings?.includeAttribution !== false;
  const apiKey = effectiveSettings?.apiKey;

  // Load featured/random images on mount
  useEffect(() => {
    if (apiKey) {
      loadFeaturedImages();
    }
  }, [apiKey]);

  const loadFeaturedImages = async (pageNum = 1, append = false) => {
    if (!apiKey) {
      setError('API key not configured');
      return;
    }

    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await fetch(
        `https://api.unsplash.com/photos?per_page=12&page=${pageNum}`,
        {
          headers: {
            Authorization: `Client-ID ${apiKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();

      if (append) {
        setImages(prev => [...prev, ...data]);
      } else {
        setImages(data);
      }

      setHasMore(data.length === 12);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load images');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const searchImages = async (searchQuery: string, pageNum = 1, append = false) => {
    if (!apiKey) {
      setError('API key not configured');
      return;
    }

    if (!searchQuery.trim()) {
      loadFeaturedImages(1, false);
      setPage(1);
      return;
    }

    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=12&page=${pageNum}`,
        {
          headers: {
            Authorization: `Client-ID ${apiKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to search images');
      }

      const data = await response.json();

      if (append) {
        setImages(prev => [...prev, ...data.results]);
      } else {
        setImages(data.results);
      }

      setHasMore(data.results.length === 12);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search images');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    searchImages(query, 1, false);
  };

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || loading || loadingMore || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    // Load more when scrolled to bottom (with 100px threshold)
    if (scrollHeight - scrollTop - clientHeight < 100) {
      const nextPage = page + 1;
      if (query.trim()) {
        searchImages(query, nextPage, true);
      } else {
        loadFeaturedImages(nextPage, true);
      }
    }
  }, [loading, loadingMore, hasMore, page, query, apiKey, searchImages, loadFeaturedImages]);

  // Attach scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleImageClick = (image: UnsplashImage, event: React.MouseEvent) => {
    // Multi-select with Ctrl/Cmd key
    if (event.ctrlKey || event.metaKey) {
      setSelectedImages(prev => {
        const newSet = new Set(prev);
        if (newSet.has(image.id)) {
          newSet.delete(image.id);
        } else {
          newSet.add(image.id);
        }
        return newSet;
      });
    } else {
      // Single select - insert immediately
      insertImages([image]);
    }
  };

  const insertImages = (imagesToInsert: UnsplashImage[]) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Parse imageSize to get width
    const width = parseInt(imageSize, 10);

    // Build markdown for all images
    const markdownParts = imagesToInsert.map(image => {
      // Get the appropriate URL based on size
      const baseUrl = image.urls.raw;
      const imageUrl = `${baseUrl}?w=${width}&q=80&fm=jpg&fit=max`;

      // Build the markdown with enhanced image extension syntax
      const altText = image.alt_description || 'Image from Unsplash';

      // Build caption with attribution if enabled
      let caption = '';
      if (includeAttribution) {
        caption = `Photo by [${image.user.name}](${image.user.links.html}?utm_source=changerawr&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=changerawr&utm_medium=referral)`;
      }

      // Use enhanced image extension syntax: ![alt](url "caption"){width=800 align=center}
      return caption
        ? `![${altText}](${imageUrl} "${caption}"){width=${width} align=center}`
        : `![${altText}](${imageUrl}){width=${width} align=center}`;
    });

    const markdown = markdownParts.join('\n\n');

    // Insert into textarea
    const newText =
      textarea.value.substring(0, start) +
      '\n' + markdown + '\n' +
      textarea.value.substring(end);

    textarea.value = newText;

    // Trigger change event
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new Event('change', { bubbles: true }));

    onClose();
  };

  const handleInsertSelected = () => {
    if (selectedImages.size === 0) return;
    const imagesToInsert = images.filter(img => selectedImages.has(img.id));
    insertImages(imagesToInsert);
  };

  // Show loading state while fetching settings
  if (loadingSettings) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading extension settings...</p>
        </div>
      </div>
    );
  }

  // Show error state if no API key configured
  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center space-y-4 max-w-md px-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-muted p-3">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">API Key Required</h3>
            <p className="text-sm text-muted-foreground">
              Please configure your Unsplash API key in extension settings before using this feature.
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Search Header */}
      <div className="p-4 border-b shrink-0">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Unsplash images..."
            className="w-full pl-10 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
          />
        </form>
      </div>

      {/* Content Area - Flex grow to fill available space */}
      <div ref={scrollContainerRef} className="overflow-y-auto overflow-x-hidden p-4 flex-1 min-h-0">
        {loading && images.length === 0 && (
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-muted animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {!loading && !error && images.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No images found</p>
          </div>
        )}

        {images.length > 0 && (
          <>
            <div className="grid grid-cols-4 gap-4">
              {images.map((image) => {
                const isSelected = selectedImages.has(image.id);
                return (
                  <button
                    key={image.id}
                    onClick={(e) => handleImageClick(image, e)}
                    className={`relative aspect-square rounded-lg overflow-hidden transition-all group shadow-md hover:shadow-lg ${
                      isSelected ? 'ring-2 ring-primary' : 'hover:ring-2 hover:ring-primary'
                    }`}
                  >
                    <img
                      src={image.urls.regular}
                      alt={image.alt_description || 'Unsplash image'}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-sm text-white font-semibold drop-shadow-lg">{image.user.name}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Loading more indicator */}
            {loadingMore && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="relative aspect-square rounded-lg overflow-hidden bg-muted animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50" />
                  </div>
                ))}
              </div>
            )}

            {/* End of results indicator */}
            {!hasMore && images.length > 0 && (
              <div className="text-center py-6">
                <p className="text-xs text-muted-foreground">That's all the images we found</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-4 flex items-center justify-between shrink-0 gap-3">
        {selectedImages.size > 0 ? (
          <>
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              {selectedImages.size} image{selectedImages.size !== 1 ? 's' : ''} selected
            </p>
            <button
              onClick={handleInsertSelected}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors whitespace-nowrap flex-shrink-0"
            >
              Insert Selected
            </button>
          </>
        ) : (
          <p className="text-xs text-muted-foreground w-full">
            Powered by{' '}
            <a
              href="https://unsplash.com/?utm_source=changerawr&utm_medium=referral"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Unsplash
            </a>
            {' • Click to insert, Ctrl+Click to select multiple'}
          </p>
        )}
      </div>
    </div>
  );
}
