const uuid = require('uuid');
const bcrypt = require('bcrypt');
const SIB = require('sib-api-v3-sdk');

const User = require('../models/user');
const Forgotpassword = require('../models/forgotpassword');

const forgotpassword = async (req, res) => {
  try {
    console.log(req.body);
    const { mail } = req.body;
    const user = await User.findOne({ where: { mail } });
    if (user) {
      const id = uuid.v4();
      await user.createForgotpassword({ id, isActive: true });

      const client = SIB.ApiClient.instance;
      const apiKey = client.authentications['api-key'];
      apiKey.apiKey = process.env.SIB_API_KEY;
      const tranEmailApi = new SIB.TransactionalEmailsApi();

      const sender = {
        email: 'divyang@gmail.com',
      };

      const reciever = [{ email: `${mail}` }];
      await tranEmailApi.sendTransacEmail({
        sender,
        to: reciever,
        subject: 'You forgot your password',
        textContent: 'Click below to reset your password',
        htmlContent: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
      });

      return res
        .status(200)
        .json({ message: 'Email sent successfully', success: true, id });
    } else {
      throw new Error('User doesnt exist');
    }
  } catch (err) {
    console.error(err);
    return res.json({ message: err, sucess: false });
  }
};

const resetpassword = (req, res) => {
  const id = req.params.id;

  Forgotpassword.findOne({ where: { id } }).then((forgotpasswordrequest) => {
    if (forgotpasswordrequest) {
      forgotpasswordrequest.update({ active: false });
      res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>Reset password</button>
                                    </form>
                                </html>`);
      res.end();
    }
  });
};

const updatepassword = (req, res) => {
  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;
    Forgotpassword.findOne({ where: { id: resetpasswordid } }).then(
      (resetpasswordrequest) => {
        User.findOne({ where: { id: resetpasswordrequest.userId } }).then(
          (user) => {
            if (user) {
              const saltRounds = 10;
              bcrypt.genSalt(saltRounds, function (err, salt) {
                if (err) {
                  console.log(err);
                  throw new Error(err);
                }
                bcrypt.hash(newpassword, salt, function (err, hash) {
                  if (err) {
                    console.log(err);
                    throw new Error(err);
                  }
                  user.update({ password: hash }).then(() => {
                    res
                      .status(201)
                      .send(
                        `<script> alert('Your password is successfully updated')</script>`
                      );
                  });
                });
              });
            } else {
              return res
                .status(404)
                .json({ error: 'No user Exists', success: false });
            }
          }
        );
      }
    );
  } catch (error) {
    return res.status(403).json({ error, success: false });
  }
};

module.exports = {
  forgotpassword,
  updatepassword,
  resetpassword,
};
