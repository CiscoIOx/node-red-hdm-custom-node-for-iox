# node-red-hdm-custom-node-for-iox

This repo contains code for Cisco IOx HDM custom node module of Node-RED. HDM stands for Host Device Management. The HDM custom node is a function that outputs real-time on-demand HDM data of IR800. The output includes the results of any show commands of the device.

## Requirements before use

- Docker deamon up and running.
- Cisco IR800 device.
- IOxCore 1.5.0, IOxGPS 1.5.1, IOxMotion 1.5.1 and IOxHdm 1.0 services running on the device.

**(If you don't want GPS service or motion service, you need to remove the dependencies in `package.yaml` and modify the base image in Dockerfile to `node0:1.0`.)**

- ioxclient installed.

## Steps to use HDM custom node

**0.1 Build Node-RED slim Docker image**

(If you already have Docker image `node0:1.0`, you can skip this step.)

Build Docker image `node0:1.0` using the following package:
https://github3.cisco.com/leyhu/node-red-slim-for-iox

**0.2 Build gps node Docker image**

(If you already have Docker image `gpsnode:1.0`, you can skip this step.)

Build Docker image `gpsnode:1.0` using the following package:
https://github3.cisco.com/leyhu/node-red-gps-node-for-iox

**0.3 Build motion node Docker image**

(If you already have Docker image `motionnode:1.0`, you can skip this step.)

Build Docker image `motionnode:1.0` using the following package:
https://github3.cisco.com/leyhu/node-red-motion-node-for-iox

**0.4 Build HDM node Docker image**

(If you already have Docker image `hdmnode:1.0`, you can skip this step.)

Build Docker image `hdmnode:1.0` using the following package:
https://github3.cisco.com/leyhu/node-red-hdm-node-for-iox

**1. Build HDM custom node Docker image**

Go to the root of this package (same path as Dockerfile) and run:
`docker build -t hdmcustomnode:1.0 .`

Don't forget the `.` at the end. It means the current directory.
This will create a Docker image `hdmcustomnode:1.0` based on the previously built image `hdmnode:1.0`.

**2. Create IOx application package**

Use the following command to build the IOx application package named **package.tar**.

`ioxclient docker package hdmcustomnode:1.0 .`

Don't forget the `.` at the end.

**3. Deploy, activate and start the app**

Deploy the application onto IR800 using Local Manager or ioxclient.

**For Local Manager option:**

Access device Local Manager UI using the URL path **https://:8443**.

Deploy the app using the name `nodered` and the package `package.tar` that you created.

![image](https://github3.cisco.com/storage/user/6479/files/825b5ae6-f245-11e8-94d2-45da3da354e8)

![image](https://github3.cisco.com/storage/user/6479/files/8b7cbdb8-f245-11e8-9e56-b106cbd22965)

Activate the app with these configurations:
- Choose `iox-nat0` for network and `1880:1880` for custom port mapping.
- Choose `async1` and `async0` for device serial ports.
- The recommended resource profile is:
  - CPU: 200 cpu-units
  - Memory: 128 MB
  - Disk: 10 MB

  You can change the combination upon the consumption of your other apps. The memory should be no less.

![image](https://github3.cisco.com/storage/user/6479/files/93de2014-f245-11e8-9307-364e6355722b)

![image](https://github3.cisco.com/storage/user/6479/files/a0e3482a-f245-11e8-91a2-d80ce111dff2)

![image](https://github3.cisco.com/storage/user/6479/files/aa38a078-f245-11e8-84f3-d86a0b2c64f1)

Finally start the app.

![image](https://github3.cisco.com/storage/user/6479/files/b9ab5104-f245-11e8-93c0-460286a01b2c)

**For ioxclient option:**

Run the following command to deploy, activate and start the app:

`ioxclient app install nodered package.tar`

`ioxclient app activate --payload activation.json nodered`

`ioxclient app start nodered`

The `activation.json` file is similar to the Sample Activation payload in [GPS service introduction of IOx](https://developer.cisco.com/docs/iox/#!how-to-install-gps-service/how-to-install-gps-service).

**4. Verify the app is running**

Open Node-RED interface at **http://:1880**.

![image](https://github3.cisco.com/storage/user/6479/files/5c77fb08-f246-11e8-92ca-d6ac1b69afc0)

Build a simple flow with `inject`, `Hdm custom IOx connector` and `debug` nodes. Use `timestamp` as the payload of `inject` node.

![image](https://github3.cisco.com/storage/user/6479/files/972a6a0e-0210-11e9-8257-9a577efc22e9)

Set `Repeat` to `none`.

![image](https://github3.cisco.com/storage/user/6479/files/089b7c00-0211-11e9-9877-54dc552a6b05)

Double click the `hdm_custom` node and type in a show command (any command built for IOS console) and deploy.

![image](https://github3.cisco.com/storage/user/6479/files/3eaec18a-0211-11e9-81c3-aa1455cc95aa)

![image](https://github3.cisco.com/storage/user/6479/files/6174ba6c-0211-11e9-8887-4f1835f401f8)

Click the button at `timestamp` node once. You'll be able to see a result of the show command you assigned.

![image](https://github3.cisco.com/storage/user/6479/files/97c3f632-0211-11e9-9502-62773e952419)

If you set `Repeat` to `interval` of `every 20 seconds` and deploy. (Some results of show commands are long and too frequent requests may break the HDM service, so longer intervals are recommended.)

![image](https://github3.cisco.com/storage/user/6479/files/db4bbbba-0211-11e9-9208-7af05da773a1)

![image](https://github3.cisco.com/storage/user/6479/files/fefd60ea-0211-11e9-8eed-23e5211a205c)

![image](https://github3.cisco.com/storage/user/6479/files/6708f226-0212-11e9-8b3f-7e4531441536)

Set `Repeat` back to `none` and deploy to stop data streaming.

**5. Export flows**

Enter IOx appconsole by:

`ioxclient app console nodered`

![image](https://github3.cisco.com/storage/user/6479/files/bde61b1e-f24a-11e8-8c4c-cee588295e0e)

Run the following command to push flows file and credentials file to Local Manager.

`sh /usr/src/node-red/hdmcustom/getflows.sh`

![image](https://github3.cisco.com/storage/user/6479/files/b7ad0320-0212-11e9-879f-8af8aec789c3)

Go to Local Manager. Click `Manage` of the nodered app. Click `App-DataDir` tab, you'll see the `flows_$(hostname).json` and `flows_$(hostname)_cred.json` files from there. Download the files to get the flows in Node-RED of this device. The credentials are encrypted.

![image](https://github3.cisco.com/storage/user/6479/files/448b8bea-f24b-11e8-9f94-c9c5b9d7f08a)

**6. Use the flows on other devices**

Go to the Local Manager of a different device. Or you can use Fog Director for multiple devices.

Upload `flows_$(hostname).json` and `flows_$(hostname)_cred.json` under `App-DataDir` tab. These two files should both be uploaded or not. They work in a pair. Use path `flows.json` and `flowscred.json` respectively to ensure that they will work on different types of devices.

![image](https://github3.cisco.com/storage/user/6479/files/44740550-f24c-11e8-9915-b7bdca4dc042)

![image](https://github3.cisco.com/storage/user/6479/files/7929e436-f24c-11e8-9a19-ecbac5963a59)

Start the nodered app of this second device. You should be able to see the flows with credentials already set up.

![image](https://github3.cisco.com/storage/user/6479/files/af21ddb4-f24c-11e8-8f0d-a54f291dc34f)

Example flows are shown below.

![image](https://github3.cisco.com/storage/user/6479/files/9bdd4cec-0201-11e9-8cff-cc04b5313108)

**7. Set up your own credentialSecret**

By default, the `credentialSecret` in `settings.js` of the nodered app is set to `cisco`. If you want to use your own `credentailSecret`, create a file called `cred.json` and upload with path `cred.json` before you start the app in IOx:

```
{
	"credentialSecret": "your own credentialSecret"

}
```

![image](https://github3.cisco.com/storage/user/6479/files/1b737472-f24e-11e8-8033-6c15efb1e9dd)

Make sure you have this `cred.json` file with the same `credentialSecret` for all your devices so that the `flows_$(hostname)_cred.json` file can be decrypted correctly.

Note that once you set `credentialSecret` you cannot change its value.