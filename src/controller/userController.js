const userModel = require("../model/userModel");



const mongoose = require('mongoose')
const { uploadFile } = require("../awsS3/aws.js")
const jwt=require('jsonwebtoken')

const isValidObjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId)
  };
const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}
const createUser = async function (req, res) {
    try {
        let requestBody = req.body
        let image = req.files;


        //validation for request body and its keys --
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: "invalid request parameters.plzz provide user details" })
            return
        }

        //Validate properties
        let {  name, email_id, phone_no, password } = requestBody

    
      

        if (!isValid(name)) {
            res.status(400).send({ status: false, message: "name is required" })
            return
        }

                if (!/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/.test(name)) {
            return res.status(400).send({ status: false, message: "Please enter valid user name." })
        }

        //Email Validation 
        if (!isValid(email_id)) {
            return res.status(400).send({ status: false, msg: "Enter email " })
        }
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim()))) {
            return res.status(400).send({ status: false, message: `Email should be a valid email address` })
            
        }
        const isemail = await userModel.findOne({ email_id })
        if (isemail) {
            return res.status(400).send({status: false, msg: "Email.  is already used" })
        }

        email_id = email_id.toLowerCase().trim()
        const emailExist = await userModel.findOne({ email: email })
        if (emailExist) {
            return res.status(400).send({ status: false, message: "Email already exists" })
        }


        //Phone Validation
        if (!isValid(phone_no)) {
            return res.status(400).send({ status: false, message: "plz enter mobile" })
        }

        // the phone no. length to 10 numeric digits only.
        if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone_no)) {
            return res.status(400).send({ status: false, message: "Please enter valid 10 digit mobile number." })
        }

        const phoneExist = await userModel.findOne({ phone: phone })
        if (phoneExist) {
            return res.status(409).send({ status: false, message: "phone number already exists" })
        }

        //Password Validations
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "plzz enter password" })
        }
        if (password.length < 10 || password.length > 15) {
            return res.status(400).send({ status: false, message: "plzz enter valid password" })
        }
       
        let images = await uploadFile(image[0])
        requestBody.userImage=images

   
        const NewUsers = await userModel.create(user)
        return res.status(201).send({ Status: true, msg: "Data sucessfully Created", data: NewUsers })

    }
    catch (error) {
        return res.status(500).send(error.message)
    }
} 
// ///////////////////////////////////////////////////////////////////////////////
const getUserdata=async function(req,res){
   
    try{
         

        const{page}=req.query
        const{limit}=req.query

        if(!page) page=1;
        if(!limit) limit=15;

        const skip=(page-1)*15

        const products=await userModel.find().skip(skip).limit(limit);

        res.status(200).send({status:true,page:page,limit:limit,product:products})



    }
    catch(err){
        console.log(err.message)
        return res.status(500).send({status:"error,i.e no page coming",msg:err.message})
    }

}
// //////////////////////////////////////////////////////////////////////////////////

const updateUser = async function (req, res) {
    try {
        let userId = req.params.userId
        
        let data = req.body
    
        let profileimage = req.files
        let getuserName = await userModel.findOne({ name: data.name })
        if (!isValidObjectId(userId))
            return res.status(400).send({ status: false, message: "The given userId is not a valid objectId" })

        if (Object.keys(data).length == 0 && file == undefined)
            return res.status(400).send({ status: false, message: "Please provide user detail that  to be updated." })

        let err = isValid( getuserName,data,profileimage)
        if (err)
            return res.status(400).send({ status: false, message: err })

        if (profileimage.length > 0) {
            let uploadedFileURL = await uploadFile(image[0])
            data.profileImage = uploadedFileURL
            
        }
      

        let updateduserdetail = await userModel.findOneAndUpdate({ _id: userId, isDeleted: false },data, { new: true })
        if (!updateduserdetail)
            return res.status(404).send({ status: false, message: "user not found." })

        return res.status(200).send({ status: true, message: "user details updated successfully.", data: updateduser })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
// //////////////////////////////////////////////////////////////////////////////////
const deleteUser = async function (req, res) {
    try {
        const userId = req.params.userId
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "userId is invalid" });
        }
        const deletedDetail = await userModel.findOneAndUpdate(
            { _id: userId},
             {isDeleted: false },
            { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })

        if (!deletedDetail) {
            return res.status(404).send({ status: false, message: 'user does not exist' })
        }
        return res.status(200).send({ status: true, message: 'user deleted successfully.' })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
module.exports = { createUser,  getUserdata, updateUser, deleteUser }

  
