const helloRoute = async  (req,res,next) => {
    res.json({"message": "Hello, World!"+process.env.profile});
}


export {helloRoute}