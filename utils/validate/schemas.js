const { celebrate, Joi } = require("celebrate");
const { messages } = require("joi-translation-pt-br");




const schemaBioPut = celebrate({
    body: Joi.object().keys({
        position: Joi.string().allow(null),
        company: Joi.string().allow(null),
        description: Joi.string().allow(null),
    })
},
    {
        abortEarly: false,
        messages: messages,
    }
);



const schemaUser = celebrate({
    body: Joi.object().keys({
        fullname: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string()
            .required()
            .min(8)
            .pattern(/[a-z]/)
            .pattern(/[A-Z]/)
            .pattern(/[0-9]/)
            .pattern(/[!@#$%^&*(),.?":{}|<>]/)
            .messages({
                'any.required': 'Senha é um campo obrigatório',
                'string.empty': 'Senha não pode ser vazia',
                'string.min': 'Senha deve ter no mínimo {#limit} caracteres',
                'string.pattern.base': 'A senha deve conter pelo menos uma letra minúscula, uma letra maiúscula, um número e um caractere especial',
            }),

        role: Joi.string().messages(
            { "string.base": "o campo de função deve ser do tipo string", }
        ),
        newletter: Joi.boolean().messages(
            { "string.base": "o campo de newletter deve ser do tipo booleano", }
        ),

    }).options({ allowUnknown: true }),
},
    {
        abortEarly: false,
        messages: messages,
    }
);

const schemaUserPut = celebrate({
    body: Joi.object().keys({
        fullname: Joi.string(),
        email: Joi.string(),
        password: Joi.string(),
        role: Joi.string(),
        newletter: Joi.number(),
    })
},
    {
        abortEarly: false,
        messages: messages,
    }
);

const schemaEvent = celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().required(),
        vacancies: Joi.string().required(),
        segment: Joi.string().required(),
        description: Joi.string().required(),
        header: Joi.string().required(),
        locationId: Joi.string().required(),
        userId: Joi.string().required(),
    })
},
    {
        abortEarly: false,
        messages: messages,
    }
);

const schemaEventPut = celebrate({
    body: Joi.object().keys({
        name: Joi.string(),
        startDate: Joi.date().iso(),
        endDate: Joi.date().iso(),
        vacancies: Joi.string(),
        segment: Joi.string(),
        description: Joi.string(),
        header: Joi.string().required(),
        locationId: Joi.string(),
        userId: Joi.string(),
    }),

},
    {
        abortEarly: false,
        messages: messages,
    }
);

const schemaLocation = celebrate({
    body: Joi.object().keys({
        cep: Joi.string().required(),
        uf: Joi.string().max(2).required(),
        cidade: Joi.string().required(),
        bairro: Joi.string().required(),
        endereco: Joi.string().required(),
        complemento: Joi.string().allow(null),
        name: Joi.string().required(),
    })
},
    {
        abortEarly: false,
        messages: messages,
    }
);
const schemaLocationPut = celebrate({
    body: Joi.object().keys({
        cep: Joi.string().required(),
        uf: Joi.string().max(2).required(),
        cidade: Joi.string().required(),
        bairro: Joi.string().required(),
        endereco: Joi.string().required(),
        complemento: Joi.string().allow(null),
        name: Joi.string().required(),
    }).options({ allowUnknown: true }),
},
    {
        abortEarly: false,
        messages: messages,
    }
);

const schemaTalks = celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().required(),
        eventId: Joi.string().required(),
        speakerId: Joi.string().required(),

    })
},
    {
        abortEarly: false,
        messages: messages,
    }
);
const schemaTalksPut = celebrate({
    body: Joi.object().keys({
        name: Joi.string(),
        startDate: Joi.date().iso(),
        endDate: Joi.date().iso(),
        eventId: Joi.string(),
        speakerId: Joi.string(),

    })
},
    {
        abortEarly: false,
        messages: messages,
    }
);

const schemaSpeaker = celebrate({
    body: Joi.object().keys({
        fullname: Joi.string().required(),
        description: Joi.string().required(),
        position: Joi.string().required(),
        company: Joi.string().allow(null),
        education: Joi.string().allow(null),
        avatar: Joi.string().allow(null),

    })
},
    {
        abortEarly: false,
        messages: messages,
    }
);
const schemaSpeakerPut = celebrate({
    body: Joi.object().keys({
        fullname: Joi.string(),
        description: Joi.string(),
        position: Joi.string(),
        company: Joi.string(),
        education: Joi.string(),
        avatar: Joi.string(),
    })
},
    {
        abortEarly: false,
        messages: messages,
    }
);

const schemaRegistration = celebrate({
    body: Joi.object().keys({
        eventId: Joi.string().required(),
        userId: Joi.string().required(),
    })
},
    {
        abortEarly: false,
        messages: messages,
    }
);
const schemaRegistrationPut = celebrate({
    body: Joi.object().keys({
        checkin: Joi.boolean(),
        qrCode: Joi.string(),
        date: Joi.date().iso(),
        eventId: Joi.string(),
        userId: Joi.string(),

    })
},
    {
        abortEarly: false,
        messages: messages,
    }
);

const schemaProfilePut = celebrate({
    body: Joi.object().keys({
        nickname: Joi.string(),
        avatar: Joi.string(),
        city: Joi.string().allow(null),

    })
},
    {
        abortEarly: false,
        messages: messages,
    }
);

const schemaPost = celebrate({
    body: Joi.object().keys({
        message: Joi.string().required(),
        eventId: Joi.string().allow(null),
        userId: Joi.string().required(),
        profileId: Joi.string().required(),
    }).options({ allowUnknown: true }),
},
    {
        abortEarly: false,
        messages: messages,
    }
);
const schemaPostPut = celebrate({
    body: Joi.object().keys({
        message: Joi.string(),
        date: Joi.date().iso(),
        eventId: Joi.string(),
        userId: Joi.string(),

    })
},
    {
        abortEarly: false,
        messages: messages,
    }
);

const schemaMessage = celebrate({
    body: Joi.object().keys({
        message: Joi.string().required(),
        sender: Joi.string().required(),
    })
},
    {
        abortEarly: false,
        messages: messages,
    }
);

const schemaFriendship = celebrate({
    body: Joi.object().keys({
        blocked: Joi.boolean(),
        receiverId: Joi.string().required(),
        senderId: Joi.string().required(),

    })
},
    {
        abortEarly: false,
        messages: messages,
    }
);
const schemaFriendshipPut = celebrate({
    body: Joi.object().keys({
        blocked: Joi.boolean(),
        receiverId: Joi.string(),
        senderId: Joi.date().iso(),

    })
},
    {
        abortEarly: false,
        messages: messages,
    }
);

const schemaMedia = celebrate({
    body: Joi.object().keys({
        link: Joi.string().required(),
        postId: Joi.string().required(),

    })
},
    {
        abortEarly: false,
        messages: messages,
    }
);
const schemaMediaPut = celebrate({
    body: Joi.object().keys({
        link: Joi.string(),
        postId: Joi.string(),


    })
},
    {
        abortEarly: false,
        messages: messages,
    }
);

const schemaEventSpeaker = celebrate({
    body: Joi.object().keys({
        eventId: Joi.string().required(),
        speakerId: Joi.string().required(),

    })
},
    {
        abortEarly: false,
        messages: messages,
    }
);
const schemaEventSpeakerPut = celebrate({
    body: Joi.object().keys({
        qrcode: Joi.string(),
        eventId: Joi.string(),
        speakerId: Joi.string(),

    })
},
    {
        abortEarly: false,
        messages: messages,
    }
);




module.exports = {
    schemaEvent,
    schemaEventPut,
    schemaUser,
    schemaUserPut,
    schemaBioPut,
    schemaLocation,
    schemaLocationPut,
    schemaTalks,
    schemaTalksPut,
    schemaEventSpeaker,
    schemaEventSpeakerPut,
    schemaMedia,
    schemaMediaPut,
    schemaMessage,
    schemaPost,
    schemaPostPut,
    schemaProfilePut,
    schemaSpeaker,
    schemaSpeakerPut,
    schemaRegistration,
    schemaRegistrationPut,
    schemaFriendship,
    schemaFriendshipPut,
}