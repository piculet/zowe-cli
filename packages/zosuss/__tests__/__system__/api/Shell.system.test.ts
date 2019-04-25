/*
* This program and the accompanying materials are made available under the terms of the
* Eclipse Public License v2.0 which accompanies this distribution, and is available at
* https://www.eclipse.org/legal/epl-v20.html
*
* SPDX-License-Identifier: EPL-2.0
*
* Copyright Contributors to the Zowe Project.
*
*/

import { Shell, SshSession } from "../../../index";
import { ITestEnvironment } from "../../../../../__tests__/__src__/environment/doc/response/ITestEnvironment";
import { TestEnvironment } from "../../../../../__tests__/__src__/environment/TestEnvironment";
import { TestProperties } from "../../../../../__tests__/__src__/properties/TestProperties";
import { ITestSystemSchema } from "../../../../../__tests__/__src__/properties/ITestSystemSchema";

let TEST_ENVIRONMENT: ITestEnvironment;
let SSH_SESSION: SshSession;
let systemProps: TestProperties;
let defaultSystem: ITestSystemSchema;
const TIME_OUT = 10000;

describe("zowe uss issue ssh api call test", () => {

    beforeAll(async () => {
        TEST_ENVIRONMENT = await TestEnvironment.setUp({
            testName: "issue_ssh_system_api",
            tempProfileTypes: ["ssh"]
        });
        SSH_SESSION = TestEnvironment.createSshSession(TEST_ENVIRONMENT);
        systemProps = new TestProperties(TEST_ENVIRONMENT.systemTestProperties);
        defaultSystem = systemProps.getDefaultSystem();
    });

    afterAll(async () => {
        await TestEnvironment.cleanUp(TEST_ENVIRONMENT);
    });

    it ("should execute uname command on the remote system by ssh and return operating system name", async () => {
        const command = "uname";
        let stdoutData = "";
        await Shell.executeSsh(SSH_SESSION, command, (data: string) => {
            stdoutData += data;
        });
        expect(stdoutData).toMatch("OS/390");

    }, TIME_OUT);

    it ("should resolve cwd option", async () => {
        const command = "pwd";
        const cwd =  `${defaultSystem.unix.testdir}`;
        let stdoutData = "";
        await Shell.executeSshCwd(SSH_SESSION, command, cwd, (data: string) => {
            stdoutData += data;
        });
        expect(stdoutData).toMatch(new RegExp("\\" + cwd + "\\s"));
    }, TIME_OUT);

});