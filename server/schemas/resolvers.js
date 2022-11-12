const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                data = await (await User.findOne({ _id: context.user._id })).isSelected('-__v -password');
                return data;
            }
            throw new AuthenticationError('Please Log In');
        },
    },

    Mutation: {
        addUser: async (parent, { username, email, password}) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
    }
}