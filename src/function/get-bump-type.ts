import {ICommit} from "./get-previous-tag-and-commit-logs";
import {analyzeCommits} from "@semantic-release/commit-analyzer";
import {ReleaseType} from "semver";
import {IActionInput} from "./get-action-input";

export const getBumpType = async (commits: Array<ICommit>, actionInput: IActionInput): Promise<ReleaseType> => {
    return await analyzeCommits({}, {commits, logger: {log: console.info.bind(console)}}) || actionInput.defaultBump;
}