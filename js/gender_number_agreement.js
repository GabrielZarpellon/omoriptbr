// NÃO MEXER!
// --------------------------------------------------------------------------------------
const GENDER = {
    MASCULINE: "MASCULINE",
    FEMININE: "FEMININE",
};

const NUMBER = {
    SINGULAR: "SINGULAR",
    PLURAL: "PLURAL",
};
// --------------------------------------------------------------------------------------

// Modifique de acordo com sua preferência:
// --------------------------------------------------------------------------------------

// O masculino predomina se não for especificado.
const STRONGER_NOUN_CLASS = GENDER.MASCULINE;

const EMOTIONS = {
    NEUTRAL: {
        MASCULINE: {
            SINGULAR: "NEUTRO",
            PLURAL: "NEUTROS",
        },
        FEMININE: {
            SINGULAR: "NEUTRA",
            PLURAL: "NEUTRAS",
        },
    },
    AFRAID: {
        MASCULINE: {
            SINGULAR: "APAVORADO",
            PLURAL: "APAVORADOS",
        },
        FEMININE: {
            SINGULAR: "APAVORADA",
            PLURAL: "APAVORADAS",
        },
    },
    "STRESSED OUT": {
        MASCULINE: {
            SINGULAR: "ESTRESSADO",
            PLURAL: "ESTRESSADO",
        },
        FEMININE: {
            SINGULAR: "ESTRESSADA",
            PLURAL: "ESTRESSADAS",
        },
    },
    HAPPY: {
        MASCULINE: {
            SINGULAR: "FELIZ",
            PLURAL: "FELIZ",
        },
        FEMININE: {
            SINGULAR: "FELIZ",
            PLURAL: "FELIZ",
        },
    },
    ECSTATIC: {
        MASCULINE: {
            SINGULAR: "EXTÁTICO",
            PLURAL: "EXTÁTICOS",
        },
        FEMININE: {
            SINGULAR: "EXTÁTICA",
            PLURAL: "EXTÁTICAS",
        },
    },
    MANIC: {
        MASCULINE: {
            SINGULAR: "MANÍACO",
            PLURAL: "MANÍACOS",
        },
        FEMININE: {
            SINGULAR: "MANÍACA",
            PLURAL: "MANÍACAS",
        },
    },
    SAD: {
        MASCULINE: {
            SINGULAR: "TRISTE",
            PLURAL: "TRISTES",
        },
        FEMININE: {
            SINGULAR: "TRISTE",
            PLURAL: "TRISTES",
        },
    },
    DEPRESSED: {
        MASCULINE: {
            SINGULAR: "DEPRIMIDO",
            PLURAL: "DEPRIMIDOS",
        },
        FEMININE: {
            SINGULAR: "DEPRIMIDA",
            PLURAL: "DEPRIMIDAS",
        },
    },
    MISERABLE: {
        MASCULINE: {
            SINGULAR: "MISERÁVEL",
            PLURAL: "MISERÁVEIS",
        },
        FEMININE: {
            SINGULAR: "MISERÁVEL",
            PLURAL: "MISERÁVEIS",
        },
    },
    ANGRY: {
        MASCULINE: {
            SINGULAR: "NERVOSO",
            PLURAL: "NERVOSOS",
        },
        FEMININE: {
            SINGULAR: "NERVOSA",
            PLURAL: "NERVOSAS",
        },
    },
    ENRAGED: {
        MASCULINE: {
            SINGULAR: "ENFURECIDO",
            PLURAL: "ENFURECIDOS",
        },
        FEMININE: {
            SINGULAR: "ENFURECIDA",
            PLURAL: "ENFURECIDAS",
        },
    },
    FURIOUS: {
        MASCULINE: {
            SINGULAR: "FURIOSO",
            PLURAL: "FURIOSOS",
        },
        FEMININE: {
            SINGULAR: "FURIOSA",
            PLURAL: "FURIOSAS",
        },
    },
};

// EVERYONE = O TIME DO OMORI/SUNNY NO TODO. 
// Aqui pode colocar personagens e inimigos para especificar se devem ser tratados em batalha no masculino ou feminino.
const CHARACTERS = {
    OMORI: {
        GENDER: GENDER.MASCULINE,
        NUMBER: NUMBER.SINGULAR,
    },
    HERO: {
        GENDER: GENDER.MASCULINE,
        NUMBER: NUMBER.SINGULAR,
    },
    AUBREY: {
        GENDER: GENDER.FEMININE,
        NUMBER: NUMBER.SINGULAR,
    },
    KEL: {
        GENDER: GENDER.MASCULINE,
        NUMBER: NUMBER.SINGULAR,
    },
    BASIL: {
        GENDER: GENDER.MASCULINE,
        NUMBER: NUMBER.SINGULAR,
    },
    MARI: {
        GENDER: GENDER.FEMININE,
        NUMBER: NUMBER.SINGULAR,
    },
    EVERYONE: {
        GENDER: GENDER.MASCULINE,
        NUMBER: NUMBER.SINGULAR,
    },
    MILKSHAKOELHO: {
        GENDER: GENDER.MASCULINE,
        NUMBER: NUMBER.SINGULAR,
    },
    BROTOPEIRA: {
        GENDER: GENDER.FEMININE,
        NUMBER: NUMBER.SINGULAR,
    },
};
// --------------------------------------------------------------------------------------

// NÃO MEXER!
// --------------------------------------------------------------------------------------

function get_plural_gender(character_names) {
    if (character_names.length === 0)
        throw new Error("Empty array!");
    const gender = character_names[0].GENDER;
    let i = 1;
    while (gender !== STRONGER_NOUN_CLASS || i !== character_names.length) {
        gender = character_names[i].GENDER;
        ++i;
    }
    return gender;
}

module.exports = { CHARACTERS, EMOTIONS, GENDER, NUMBER, get_plural_gender };
// --------------------------------------------------------------------------------------
