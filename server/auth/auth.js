// const User = require('../models/User');

// module.exports = {
//   init() {
//     passport.serializeUser((user, done) => {
//       done(null, user);
//     });

//     passport.deserializeUser((user, done) => {
//       done(null, user);
//     });

//     passport.use(new LocalStrategy(
//       { usernameField: 'email', passwordField: 'password' },
//       async (email, password, done) => {
//         try {
//           let user = await User.findByEmail(email).select('+password');

//           if (!user) {
//             done(null, null, { message: 'Incorrect email.' });
//             return;
//           }

//           if (!await User.comparePasswords(password, user.password)) {
//             done(null, null, { message: 'Incorrect password.' });
//             return;
//           }

//           user = await user.toJSON();
//           delete user.password;
//           done(null, user);
//         } catch (error) {
//           done(error);
//         }
//       },
//     ));
//   },
// };
