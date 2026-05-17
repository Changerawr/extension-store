'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface UnsplashBrowserProps {
  textarea: HTMLTextAreaElement;
  onClose: () => void;
  settings?: {
    apiKey?: string;
    defaultSize?: string;
    includeAttribution?: boolean;
  };
  extensionName?: string;
}

interface UnsplashImage {
  id: string;
  urls: {
    thumb: string;
    small: string;
    regular: string;
    full: string;
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

export function UnsplashBrowser({ textarea, onClose, settings, extensionName }: UnsplashBrowserProps) {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedSettings, setFetchedSettings] = useState<typeof settings | null>(null);

  // Fetch settings from API if not provided and we have an extension name
  useEffect(() => {
    if ((!settings || !settings.apiKey) && extensionName) {
      // First get the extension by name to get its ID
      fetch(`/api/extensions`)
        .then(res => res.json())
        .then(extensions => {
          const extension = extensions.find((ext: any) => ext.name === extensionName);
          if (extension?.id) {
            return fetch(`/api/extensions/${extension.id}/settings`);
          }
          throw new Error('Extension not found');
        })
        .then(res => res.json())
        .then(data => setFetchedSettings(data.settings || data))
        .catch(err => console.error('Failed to fetch extension settings:', err));
    }
  }, [settings, extensionName]);

  const effectiveSettings = settings?.apiKey ? settings : fetchedSettings;
  const defaultSize = effectiveSettings?.defaultSize || 'regular';
  const includeAttribution = effectiveSettings?.includeAttribution !== false;
  const apiKey = effectiveSettings?.apiKey;

  // Load featured/random images on mount
  useEffect(() => {
    if (apiKey) {
      loadFeaturedImages();
    }
  }, [apiKey]);

  const loadFeaturedImages = async () => {
    if (!apiKey) {
      setError('API key not configured');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.unsplash.com/photos?per_page=12`,
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
      setImages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const searchImages = async (searchQuery: string) => {
    if (!apiKey) {
      setError('API key not configured');
      return;
    }

    if (!searchQuery.trim()) {
      loadFeaturedImages();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=12`,
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
      setImages(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search images');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchImages(query);
  };

  const insertImage = (image: UnsplashImage) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Get the image URL based on default size
    const imageUrl = image.urls[defaultSize as keyof typeof image.urls] || image.urls.regular;

    // Build the markdown
    const altText = image.alt_description || 'Image from Unsplash';
    let markdown = `![${altText}](${imageUrl})`;

    // Add attribution if enabled
    if (includeAttribution) {
      markdown += `\n*Photo by [${image.user.name}](${image.user.links.html}?utm_source=changerawr&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=changerawr&utm_medium=referral)*`;
    }

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

  if (!apiKey) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Please configure your Unsplash API key in extension settings before using this feature.
        </p>
      </div>
    );
  }

  return (
    <div className="w-[500px] max-h-[600px] flex flex-col">
      {/* Search Header */}
      <div className="p-3 border-b">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Unsplash images..."
            className="w-full pl-9 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </form>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-3">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {!loading && !error && images.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No images found</p>
          </div>
        )}

        {!loading && !error && images.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {images.map((image) => (
              <button
                key={image.id}
                onClick={() => insertImage(image)}
                className="relative aspect-square rounded overflow-hidden hover:ring-2 hover:ring-primary transition-all group"
              >
                <img
                  src={image.urls.thumb}
                  alt={image.alt_description || 'Unsplash image'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs text-white truncate">{image.user.name}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t text-center">
        <p className="text-xs text-muted-foreground">
          Powered by{' '}
          <a
            href="https://unsplash.com/?utm_source=changerawr&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Unsplash
          </a>
        </p>
      </div>
    </div>
  );
}
