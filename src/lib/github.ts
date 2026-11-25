import { env } from "./env.js";

interface CommitFileParams {
  path: string;
  content: Buffer | string;
  isBinary?: boolean;
  message?: string;
}

interface DeleteFileParams {
  path: string;
  message?: string;
}

interface FrontmatterData {
  title?: string;
  slug?: string;
  excerpt?: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  publishedAt?: string;
  isPublished?: boolean;
  readingTime?: string;
  author?: string;
  [key: string]: unknown;
}

interface SyncMarkdownParams {
  module: "blog" | "project" | "case-study" | "book";
  folderKey: string;
  frontmatter: FrontmatterData;
  content: unknown;
}

const GITHUB_API_BASE = "https://api.github.com";

const getHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "AbdullahAlMaksudServer",
  };

  if (env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
  }

  return headers;
};

/**
 * Checks if GitHub token is configured.
 */
export const isGitHubConfigured = (): boolean => {
  return Boolean(env.GITHUB_TOKEN && !env.GITHUB_TOKEN.includes("your_github_"));
};

/**
 * Retrieves the current SHA of a file in the repository (if it exists).
 */
export const getFileSha = async (path: string): Promise<string | undefined> => {
  if (!isGitHubConfigured()) return undefined;

  const cleanPath = path.replace(/^\/+/, "");
  const url = `${GITHUB_API_BASE}/repos/${env.GITHUB_REPO_OWNER}/${env.GITHUB_REPO_NAME}/contents/${cleanPath}?ref=${env.GITHUB_BRANCH}`;

  try {
    const res = await fetch(url, { headers: getHeaders() });
    if (res.ok) {
      const data = (await res.json()) as { sha?: string };
      return data.sha;
    }
  } catch (err) {
    console.warn(`[GitHub] Failed to get file SHA for ${cleanPath}:`, err);
  }

  return undefined;
};

/**
 * Commits a binary file (e.g. WebP image) or text file to the GitHub repository.
 */
export const commitFileToGitHub = async ({
  path,
  content,
  isBinary = false,
  message,
}: CommitFileParams): Promise<{ success: boolean; sha?: string; path: string }> => {
  const cleanPath = path.replace(/^\/+/, "");

  if (!isGitHubConfigured()) {
    console.warn(
      `[GitHub Mock] GITHUB_TOKEN not configured. Skipping remote commit for: ${cleanPath}`,
    );
    return { success: true, path: cleanPath };
  }

  const existingSha = await getFileSha(cleanPath);

  const base64Content = isBinary
    ? Buffer.isBuffer(content)
      ? content.toString("base64")
      : Buffer.from(content).toString("base64")
    : Buffer.from(content as string, "utf-8").toString("base64");

  const commitMessage =
    message || (existingSha ? `chore: update ${cleanPath}` : `feat: add ${cleanPath}`);

  const url = `${GITHUB_API_BASE}/repos/${env.GITHUB_REPO_OWNER}/${env.GITHUB_REPO_NAME}/contents/${cleanPath}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      ...getHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: commitMessage,
      content: base64Content,
      branch: env.GITHUB_BRANCH,
      ...(existingSha ? { sha: existingSha } : {}),
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`GitHub API commit failed for ${cleanPath} (HTTP ${res.status}): ${errorText}`);
  }

  const result = (await res.json()) as { content?: { sha?: string } };
  return {
    success: true,
    sha: result.content?.sha,
    path: cleanPath,
  };
};

/**
 * Deletes a file from the GitHub repository by path.
 */
export const deleteFileFromGitHub = async ({
  path,
  message,
}: DeleteFileParams): Promise<{ success: boolean }> => {
  const cleanPath = path.replace(/^\/+/, "");

  if (!isGitHubConfigured()) {
    console.warn(
      `[GitHub Mock] GITHUB_TOKEN not configured. Skipping remote delete for: ${cleanPath}`,
    );
    return { success: true };
  }

  const existingSha = await getFileSha(cleanPath);
  if (!existingSha) {
    // File already does not exist
    return { success: true };
  }

  const url = `${GITHUB_API_BASE}/repos/${env.GITHUB_REPO_OWNER}/${env.GITHUB_REPO_NAME}/contents/${cleanPath}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      ...getHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: message || `chore: delete ${cleanPath}`,
      sha: existingSha,
      branch: env.GITHUB_BRANCH,
    }),
  });

  if (!res.ok && res.status !== 404) {
    const errorText = await res.text();
    throw new Error(`GitHub API delete failed for ${cleanPath} (HTTP ${res.status}): ${errorText}`);
  }

  return { success: true };
};

/**
 * Lists all image files in the repository using the Git Trees API.
 * Preserves exact compatibility with the Admin Media Manager format.
 */
export const listRepositoryImages = async (
  prefix?: string,
): Promise<{
  blobs: Array<{
    url: string;
    downloadUrl: string;
    pathname: string;
    size: number;
    uploadedAt: string;
  }>;
  hasMore: boolean;
}> => {
  if (!isGitHubConfigured()) {
    return { blobs: [], hasMore: false };
  }

  const url = `${GITHUB_API_BASE}/repos/${env.GITHUB_REPO_OWNER}/${env.GITHUB_REPO_NAME}/git/trees/${env.GITHUB_BRANCH}?recursive=1`;

  try {
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) {
      console.warn(`[GitHub] Trees API returned HTTP ${res.status}`);
      return { blobs: [], hasMore: false };
    }

    const data = (await res.json()) as {
      tree?: Array<{ path: string; mode: string; type: string; size?: number }>;
    };

    const tree = data.tree || [];
    const baseUrl = env.ASSET_CDN_BASE_URL.replace(/\/+$/, "");

    const imageExtensions = [".webp", ".png", ".jpg", ".jpeg", ".svg", ".gif", ".avif"];

    const blobs = tree
      .filter((item) => {
        if (item.type !== "blob") return false;
        const lower = item.path.toLowerCase();
        const isImage = imageExtensions.some((ext) => lower.endsWith(ext));
        if (!isImage) return false;
        if (prefix) return item.path.startsWith(prefix);
        return item.path.startsWith("images/");
      })
      .map((item) => {
        const fileUrl = `${baseUrl}/${item.path}`;
        return {
          url: fileUrl,
          downloadUrl: fileUrl,
          pathname: item.path,
          size: item.size || 0,
          uploadedAt: new Date().toISOString(),
        };
      })
      .reverse(); // Newest first

    return { blobs, hasMore: false };
  } catch (err) {
    console.error("[GitHub] Failed to list repository images:", err);
    return { blobs: [], hasMore: false };
  }
};

/**
 * Serializes block editor JSON, array of blocks, or plain string into clean Markdown.
 */
export const lexicalToMarkdown = (content: unknown): string => {
  if (!content) return "";
  if (typeof content === "string") return content;

  // If array of blocks (e.g. Lexical BlogBlock[])
  if (Array.isArray(content)) {
    return content
      .map((block: unknown) => {
        if (!block) return "";
        if (typeof block === "string") return block;
        if (typeof block === "object" && block !== null) {
          const b = block as {
            data?: { markdown?: string; text?: string; code?: string; language?: string };
            text?: string;
          };
          if (b.data?.markdown) return b.data.markdown;
          if (b.data?.text) return b.data.text;
          if (b.data?.code) return `\`\`\`${b.data.language || ""}\n${b.data.code}\n\`\`\``;
          if (b.text) return b.text;
        }
        return "";
      })
      .filter(Boolean)
      .join("\n\n");
  }

  // If object with markdown field
  if (typeof content === "object" && content !== null) {
    const record = content as Record<string, unknown>;
    if (record.markdown && typeof record.markdown === "string") {
      return record.markdown;
    }
    if (record.text && typeof record.text === "string") {
      return record.text;
    }
  }

  return "";
};

/**
 * Builds YAML frontmatter and serializes content to Markdown in the private GitHub repo.
 * Runs asynchronously in the background.
 */
export const syncMarkdownContent = async ({
  module,
  folderKey,
  frontmatter,
  content,
}: SyncMarkdownParams): Promise<void> => {
  try {
    if (!folderKey) return;

    const lines = ["---"];
    for (const [key, val] of Object.entries(frontmatter)) {
      if (val === undefined || val === null || val === "") continue;
      if (Array.isArray(val)) {
        lines.push(`${key}:`);
        for (const item of val) {
          lines.push(`  - "${String(item).replace(/"/g, '\\"')}"`);
        }
      } else if (typeof val === "boolean" || typeof val === "number") {
        lines.push(`${key}: ${val}`);
      } else {
        lines.push(`${key}: "${String(val).replace(/"/g, '\\"')}"`);
      }
    }
    lines.push("---");
    lines.push("");

    const markdownBody = lexicalToMarkdown(content);
    lines.push(markdownBody);

    const fullMarkdownText = lines.join("\n");
    const targetPath = `content/${module}/${folderKey}.md`;

    await commitFileToGitHub({
      path: targetPath,
      content: fullMarkdownText,
      isBinary: false,
      message: `docs(${module}): backup ${folderKey}.md content`,
    });
  } catch (err) {
    console.error(`[GitHub Sync] Error backing up ${module}/${folderKey}.md:`, err);
  }
};
