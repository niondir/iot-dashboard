# Security

Security should be considered from the very beginning. We like to address some threads and solutions here and explain how they are implemented in the Dashboard.

**In case you have any security concerns feel free to contact us by creating a Github issue.**

## Client side Security
Some security aspects are already considered in the client code of the Dashboard.

### Encoding / Escaping
**Thread:** Having a wrong output encoding might lead to XSS, i.e. an attacker could insert a `<script>` tag that executes malicious code on behalf of the visitor.

**Solution:** All user input is displayed using React components. React "React escapes all the strings you are displaying in order to prevent a wide range of XSS attacks by default."

See also: [JSX-gotchas (Encoding)](https://facebook.github.io/react/docs/jsx-gotchas.html)

## Server side Security
Currently we host the dashboard only on Github, but as soon as some one start hosting his own instance we highly recommend to consider some security headers, set by the server.

### Content-Security-Policy
Using the Content-Security-Policy headers you can restrict the execution of eval(), inline JS n HTML and restrict content sources to certain URL.

Some usecases:

* You can allow only certain trusted plugin repositories
* Forbid plugin development in a production dashboard by just disable eval()

Read more at: [content-security-policy.com](http://content-security-policy.com/)

### Cross-Origin Resource Sharing (CORS)

Read more at: [www.html5rocks.com](http://www.html5rocks.com/en/tutorials/cors/)
