package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.BuildType
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.perfmon
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.ExecBuildStep
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.exec
import jetbrains.buildServer.configs.kotlin.v2019_2.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, create a buildType with id = 'BuildBaseImages'
in the root project, and delete the patch script.
*/
create(DslContext.projectId, BuildType({
    id("BuildBaseImages")
    name = "Build base images"
    description = "Build base docker images"

    buildNumberPattern = "%build.prefix%.%build.counter%"

    params {
        param("build.prefix", "1.0")
    }

    vcs {
        root(DslContext.settingsRoot)

        cleanCheckout = true
        branchFilter = """
            +:*
            +:wip/docker-for-ci
        """.trimIndent()
    }

    steps {
        exec {
            name = "Build docker images"
            path = "./bin/build-docker.sh"
            arguments = "%build.number%"
            dockerImagePlatform = ExecBuildStep.ImagePlatform.Linux
            dockerRunParameters = "-u %env.UID%"
            param("script.content", """
                set -e
                export HOME="/calypso"
                export NODE_ENV="test"
                export CHROMEDRIVER_SKIP_DOWNLOAD=true
                export PUPPETEER_SKIP_DOWNLOAD=true
                export npm_config_cache=${'$'}(yarn cache dir)
                
                # Update node
                . "${'$'}NVM_DIR/nvm.sh" --install
                nvm use
                
                # Install modules
                yarn install
            """.trimIndent())
        }
    }

    features {
        perfmon {
        }
    }
}))

