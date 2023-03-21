## Instructions for GitHub Codespaces

1. Navigate your browser to [the repo](https://github.com/MikeHopcroft/chat-dsl).
1. Click on the green button labeled `<> Code`.
![Codespaces](/docs/assets/codespaces.png)
1. Click the `+` button to the right of the text that says *"Codespaces, Your Workspaces in the Cloud"*.
1. A new Codespace will start up. It will take a few minutes for it to build the dev container.
1. When the Codespace is ready, Visual Studio Code will open in the browser.
1. In the terminal at the bottom of Visual Studio Code, type the following:
~~~shell
@User ➜ /workspaces/chat-dsl (main) $ yarn install
@User ➜ /workspaces/chat-dsl (main) $ tsc
@User ➜ /workspaces/chat-dsl (main) $ node build/src/main.js
~~~
