#### Step 1: First, clone the repo

```bash
git clone https://github.com/ArnabBCA/OAuth.git
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 4 : Visit AuthO by Okta and create a account

```bash
https://auth0.com/
```

#### Step 5: Follow the steps below to get your .env.local variables.

#### Step 6 : On the left handside on the dashboard page click Application then APIs then click `CREATE API`

![image](https://github.com/user-attachments/assets/e70be251-841e-4ab9-a3c5-f97f85ac0575)


#### Step 7 : One the `Name` field give any name of your choice. <br/> On the `Identifier` type the following `https://demo.com/api` you can adjust the nameing if you want but it should start with `https://` <br/> Keep all the other fields to default values.

![image-1](https://github.com/user-attachments/assets/f065f01f-6c3f-4f18-bb21-6506039b6610)


#### Step 8 :Then Open the API you just created And `COPY` the `Identifier` which you created earlier and put inside the `.local.env` as given below below

```bash
NEXT_PUBLIC_AUDIENCE_TARGET_API=(yourkey)
```

![image-2](https://github.com/user-attachments/assets/6394a405-40ee-42aa-af4e-692c6e4faee4)


#### Step 9 :Scroll below and toggle the `Allow Offline Access` and then CLick `Save`

![image-3](https://github.com/user-attachments/assets/5b3b00d9-e0be-4c8a-a3cd-cecbd4d34eb5)


#### Step 10 : Move to Applications then click the button `Create Application`

![image-4](https://github.com/user-attachments/assets/4d56fd3e-c03c-44f2-83bd-568231e1ae89)


#### Step 11 : In the Dialog select `Single Page Applications` then click the `Create` button.

![image-5](https://github.com/user-attachments/assets/7b61dfc0-a323-42a3-99ee-a7b1764f2c24)


#### Step 12 : Open the Created Application and copy the `Domain`, `Client ID`, ans paste in the `.env.local`

```bash
NEXT_PUBLIC_DOMAIN=(yourkey)
NEXT_PUBLIC_CLIENT_ID=(yourkey)
```

![image-6](https://github.com/user-attachments/assets/64420cca-c1be-4188-90d6-3db4c48085c3)


#### Step 13 : Then as shown in the pictures given below scroll and input the following in their respective fields `Allowed Callback URLs`, `Allowed Logout URLs`, `Allowed Web Origins`. Keep rest of the field to default values. The First Callback URL ` http://localhost:3000 ` is used when we only want `Client` Side Authentication, and the second one `http://localhost:3000/api/auth/callback` is for `Server` side authentication


![image](https://github.com/user-attachments/assets/2c24d42c-8c8c-4da6-9b2c-28c0bf75b3e0)

![image-9](https://github.com/user-attachments/assets/493b5d18-ef19-49a1-bd94-3984bbf52465)


<br />

#### Step 14 : Your final `.env.local` should look like this paste this file in the root project folder.

```bash
NEXT_PUBLIC_DOMAIN=(yourkey)
NEXT_PUBLIC_CLIENT_ID=(yourkey)
NEXT_PUBLIC_AUDIENCE_TARGET_API=(yourkey)

NEXT_PUBLIC_CALLBACK_URL=http://localhost:3000 (For client side auth) or http://localhost:3000/api/auth/callback (For server side auth)
NEXT_PUBLIC_LOGOUT_URL=http://localhost:3000/login
```

#### Step 4: Start the development server

```bash
npm run dev
```

#### Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Adding more social providers (Optional)

#### Step 1: Go to the `Authentication` tab then to `Social` then click `Create Connection`

![image-10](https://github.com/user-attachments/assets/58ad5660-1906-4e6d-a1a7-53420d1ac570)


#### Step 2: Choose a Social Connection for example `GitHub` then open it then click `Continue. On the dialog box click `Create` leave every thing to default values

![image-11](https://github.com/user-attachments/assets/61074236-a87d-4272-a5b8-d903bdbcade8)

![image-12](https://github.com/user-attachments/assets/bf0a01e6-b478-4496-8fcb-ceaaf0a3cb68)


#### Step-3: Toggle the Applications ( `API` and `Single Page Application`) we created Earlier.<Br> Below is a Eample: The the names of the applications will be different in your case

![image-13](https://github.com/user-attachments/assets/33f71129-3641-4efa-af56-3e413bade6f1)

