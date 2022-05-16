const allowedPropTypes = [
    "Sprite",
    "Shape",
    "Static",
    "Container"
]

function checkPropTypes(props, className, exclude = []) {
    let useableProps = [];

    for (let i = 0; i < props.length; i++) {
        const propType = props[i].constructor.name;

        if (propType === "Array" && i === 0) {
            useableProps = props[i];
            break;
        }

        if (!allowedPropTypes.includes(propType) || exclude.includes(propType)) {
            console.warn(`Prop type '${propType}' is not supported for Aurora.${className}.`);
            continue;
        }

        useableProps.push(props[i]);
    }

    return useableProps;
}

export { allowedPropTypes, checkPropTypes };