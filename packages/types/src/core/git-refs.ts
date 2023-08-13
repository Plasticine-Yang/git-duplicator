/**
 * 执行 git ls-remote 命令得到的解析后的结果
 *
 * 原始输出：
 * ```text
 * b483cf2f141e4b12cf0e7dd47cd91b0c11e24941	HEAD
 * b483cf2f141e4b12cf0e7dd47cd91b0c11e24941	refs/heads/main
 * ```
 */
export type GitRefs = Record<string, string>
