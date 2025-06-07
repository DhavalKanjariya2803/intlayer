/**
 * Represents the metadata for a markdown content
 */
export interface MarkdownMetadata {
  /**
   * The title of the markdown content
   */
  title?: string;

  /**
   * The description of the markdown content
   */
  description?: string;

  /**
   * The creation date of the markdown content
   */
  createdAt?: string;

  /**
   * The last update date of the markdown content
   */
  updatedAt?: string;

  /**
   * The author of the markdown content
   */
  author?: string;

  /**
   * The tags associated with the markdown content
   */
  tags?: string[];

  /**
   * Any additional custom metadata
   */
  [key: string]: any;
}

/**
 * Props for the MarkdownRenderer component
 */
export interface MarkdownRendererProps {
  /**
   * The markdown content to render
   */
  content: string;

  /**
   * The metadata associated with the markdown content
   */
  metadata?: MarkdownMetadata;

  /**
   * The current locale
   */
  locale: string;
}
