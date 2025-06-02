# Atom Launcher - Minecraft Java Edition Launcher

## Introduction
Atom Launcher is a cross platform launcher specifically designed for Minecraft Java Edition players. It features a modern flat user interface, providing players with a simple, beautiful, and comfortable operating experience. Launcher supports both Offline (Legacy) and Yggdrasil (Mojang) profile.

## Features
1. **Cross platform Support**: Whether you are using Windows, Mac, or Linux systems, Atom Launcher can run smoothly.
2. **Modern Flat UI**: The simple and beautiful interface design is intuitive and easy to operate, enabling you to get started quickly.
3. **Multi-threaded Download**: It greatly improves the download speed of game resources.
4. **Multiple Login Methods**: It supports offline (Legacy) login, which is convenient for players without a genuine account. At the same time, it also supports Yggdrasil (Mojang) for third-party authentification.

## Installation and Usage

### Installation
1. Clone this repository to your local machine:
```bash
git clone https://github.com/your-repo/atom.git
```
2. Navigate to the project directory:
```bash
cd atom
```
3. Install the dependencies:
```bash
npm install
```

### Running
- Run in the development environment:
```bash
npm run start
```
- Package the application:
```bash
npm run package
```
- Build a distributable version:
```bash
npm run make
```

### Usage
1. Start Atom Launcher.
2. Select the offline (Legacy) or Yggdrasil (Mojang) login method according to your situation and log in.
3. Configure game - related parameters in the settings, such as the Java path and memory allocation.
4. Select the game version you want to install and click the install button to install the game.
5. After the installation is complete, click the start button to begin playing the game.

## Code Structure
The following is an overview of the main code files in the project and their functions:
- `atom/src/renderer`: Code related to the rendering process, responsible for the display and interaction of the user interface.
  - `pages`: Contains components for each page, such as the home page, settings page, and installation page.
  - `api`: API services for communicating with the main process.
  - `router.tsx`: Routing configuration file for page navigation.
- `atom/src/main`: Code related to the main process, responsible for handling system - level tasks.
  - `services`: Contains various service classes, such as user services and client services.
  - `controllers`: Controller classes for handling IPC communication requests.
  - `utils`: Utility classes, including some auxiliary functions and tool methods.
- `atom/src/common`: Common code shared between the rendering process and the main process.
  - `types`: Type definition files to ensure type safety in the code.
  - `utils`: General utility functions.

## Configuration Instructions
On the settings page, you can configure the following parameters:
- **Minecraft Folder**: Specify the path to the Minecraft game folder.
- **Java Path**: Specify the path to the Java runtime environment.
- **JVM Arguments**: Set additional JVM parameters.
- **MC Arguments**: Set additional Minecraft game parameters.
- **Allocated Memory**: Allocate the amount of memory for the game, which can be adjusted according to your computer configuration.

## License
This project is licensed under the MIT license. Please refer to the [LICENSE](LICENSE) file for details.

## Contact Us
If you encounter any problems or have any suggestions during use, please feel free to submit an issue on the project's [Issues](https://github.com/Dawson924/atom/issues) page.
