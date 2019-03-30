<<<<<<< HEAD
'use strict';

const User = require('../models/user');
const Donation = require('../models/donation');
const Candidate = require('../models/candidate');

const Donations = {
  home: {
    handler: async function(request, h) {
      const candidates = await Candidate.find();
      return h.view('home', { title: 'Make a Donation', candidates: candidates });
    }
  },
  report: {
    handler: async function(request, h) {
      try {
        const donations = await Donation.find().populate('donor').populate('candidate');
        return h.view('report', {
          title: 'Donations to Date',
          donations: donations
        });
      } catch (err) {
        return h.view('main', { errors: [{ message: err.message }] });
      }
    }
  },
  donate: {
    handler: async function(request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        const data = request.payload;

        const rawCandidate = request.payload.candidate.split(',');
        const candidate = await Candidate.findOne({
          lastName: rawCandidate[0],
          firstName: rawCandidate[1]
        });

        const newDonation = new Donation({
          amount: data.amount,
          method: data.method,
          donor: user._id,
          candidate: candidate._id
        });
        await newDonation.save();
        return h.redirect('/report');
      } catch (err) {
        return h.view('main', { errors: [{ message: err.message }] });
      }
    }
  }
};

module.exports = Donations;
=======
'use strict';

const Donations = {
  home: {
    handler: function(request, h) {
      return h.view('home', { title: 'Make a Donation' });
    }
  },
  report: {
    handler: function(request, h) {
      return h.view('report', {
        title: 'Donations to Date',
        donations: this.donations
      });
    }
  },
  donate: {
    handler: function(request, h) {
      const data = request.payload;
      this.donations.push(data);
      return h.redirect('/report');
    }
  }
};

module.exports = Donations;
>>>>>>> 182f41e5dd3a29994700914bf4669b8399493433
