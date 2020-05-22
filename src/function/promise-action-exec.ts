import {exec as _exec} from "@actions/exec";

export interface IExecResponse {
    code: number;
    stdout: string;
    stderr: string;
    error?: any;
}

/**
 * execute command over github actions
 * @param command the command to execute
 */
export const exec = async (command: string): Promise<IExecResponse> => {
    let stdout = "";
    let stderr = "";
    try {
        return {
            code: await _exec(command, undefined, {
                listeners: {
                    stdout: (data: Buffer) => {
                        stdout += data.toString();
                    },
                    stderr: (data: Buffer) => {
                        stderr += data.toString();
                    },
                },
            }),
            stdout,
            stderr,
        };
    } catch (err) {
        throw new Error(`Error in command '${command}', ${err.toString()} `)
    }
}