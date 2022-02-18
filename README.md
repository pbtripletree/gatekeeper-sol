# Usage

## Install

```
npm i gatekeeper-sol
```

#### 1. Import

```
const { authorize } = require("gatekeeper-sol");
```

#### 2. authorize() expects a list of roles and token addresses that assume the role, as well as a decoded SiwsMessage

<br>
<i>```authorize``` will validate your SiwsMessage, but we suggest you .validate() yourself before incurring a network request</i>

```
const roles = [
  {
    role: "super-fan",
    addresses: ["AYcSvXDXUT292DgaTG9AJLmpNBtUPpzndAdC5KVabz86"],
  },
  {
    role: "fan",
    addresses: ["7rJ51pjsEvAAWETpu1iJj465FKSz5RgPFa3HwXu8kZwV"],
  },
];

const siwsMessage = new SiwsMessage({}).decode(token);

const authorizeResponse = await authorize({
  request: siwsMessage,
  roles
})
```

#### 3. authorize will return an object with a success status, message, and a list of roles if valid roles are found for the requesting address

```
// roles found
{
  success: true,
  message: 'roles found',
  roles: [ 'super-fan' ]
}

//no roles found
{
  success: false,
  message: 'no roles found',
  roles: null
}

```
