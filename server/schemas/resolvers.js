const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                data = await (await User.findOne({ _id: context.user._id })).select('-__v -password');
                return data;
            }
            throw new AuthenticationError('Please Log In');
        },
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
          },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('No matching credentials');
            }
            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError ('No matching credentials');
            }

            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { newBook }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    {_id: context.user._id },
                    {$push: { savedBooks: newBook }},
                    { new: true }
                );
                return updatedUser;

            }
            throw new AuthenticationError('Please Log in');

        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: {savedBooks: { bookId }}},
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError ('Please Logg In');
        },
    }
};

module.exports = resolvers;