# Password recovery

** RF **

- The user must be able to recover his password informing his e-mail;
- The user should receive an email with password recovery instructions;
- The user must be able to reset his password;

** RNF **

- Use Mailtrap to test e-mail sending in a dev environment;
- Use Amazon SES for production shipments;
- The sending of e-mail must happen in the background (background job);


** RN **

- The link sent by email to reset password, must expire in 2h;
- The user needs to confirm the new password when resetting his password;

# Profile update

** RF **

- The user must be able to update his profile (name, email, and password);

** RN **

- The user cannot change his email to an email already used;
- To update your password, the user must inform the old password;
- To update your password, the user needs to confirm the new password;

# Provider panel

** RF **

- The user must be able to list their schedules for a specific day;
- The provider must receive a notification whenever he hears a new appointment;
- The provider must be able to view unread notifications;

** RNF **

- The provider's schedules on the day must be stored in cache;
- The provider's notifications must be stored in MongoDB;
- The provider's notifications must be sent in time- real using Socket.io;


** RN **

- The notification must have a read or unread status so that the provider can control;

# Service scheduling

** RF **

- The user must be able to list all registered service providers;
- The user must be able to list the days of a month with at least one schedule from an available provider;
- The user must be able to list available times on a specific day for a provider;
- The user must be able to make a new appointment with a provider;

** RNF **

- The list of providers must be stored in chache;

** RN **

- Each appointment must last exactly 1 hour;
- Appointments must be available between 8 am and 6 pm (First at 8 am and last at 5 pm);
- The user cannot schedule at an already busy time;
- The user cannot schedule an appointment that has already passed;
- The user cannot schedule services with himself;
