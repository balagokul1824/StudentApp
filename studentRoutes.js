/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student management APIs
 */

const express=require("express")
const Student =require("./Student")
const multer =require("multer")
const path =require("path");
const fs = require("fs");
// const { json } = require("stream/consumers");

const router =express.Router();

const storage=multer.diskStorage({
    destination:"./uploads",
    filename:(req,file,cb) =>{
        cb(null,Date.now()+path.extname(file.originalname))
    }
    
})

const upload= multer({storage})

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create a student
 *     tags: [Students]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               dob:
 *                 type: string
 *               gender:
 *                 type: string
 *               mobile:
 *                 type: string
 *               email:
 *                 type: string
 *               bloodGroup:
 *                 type: string
 *               nationality:
 *                 type: string
 *               physicallyChallenged:
 *                 type: string
 *               qualification:
 *                 type: string
 *                 description: JSON array — e.g. [{ "degree":"BCom","institution":"Tagore" }]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Student created successfully
 */

// create
router.post("/",upload.single("image"),async(req,res)=>{
    try {
             console.log("RAW QUAL:", req.body.qualification);
            if(req.body.qualification){
                    req.body.qualification=JSON.parse(req.body.qualification)
                    console.log("PARSED QUAL:", req.body.qualification);
            }
        const student=new Student({ 
            
            ...req.body, 
            image:req.file ? req.file.filename:null
        })
        console.log(student);
        await student.save()
        res.json(student)

    } catch (error) {
        res.status(400).json({ message: error.message})
    }
})

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: List of students
 */

// getAll 
router.get("/",async(req,res)=>{
    const student=await Student.find();
    res.json(student)
})

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Get student by ID
 *     tags: [Students]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student found
 */

// get by id
router.get("/:id",async(req,res)=>{
    const student=await Student.findById(req.params.id);
    res.json(student)
})


/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Update a student (with optional image)
 *     tags: [Students]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               dob:
 *                 type: string
 *               gender:
 *                 type: string
 *               mobile:
 *                 type: string
 *               email:
 *                 type: string
 *               bloodGroup:
 *                 type: string
 *               nationality:
 *                 type: string
 *               physicallyChallenged:
 *                 type: string
 *               qualification:
 *                 type: string
 *                 description: JSON array — e.g. [{ "degree":"BCom","institution":"Tagore" }]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Student updated successfully
 */

// update
router.put("/:id",upload.single("image"),async(req,res)=>{
    try {
        const existing = await Student.findById(req.params.id);
        if(! existing){
            return res.status(404).json({  message:"Student not found"}) }
        
        const updateData ={};
        for(const key in req.body){
                if(req.body[key]!=="" && req.body[key] !== null && req.body[key] !== undefined){
                    updateData[key]=req.body[key];
                }
        }

        if(req.body.qualification){
            updateData.qualification=JSON.parse(req.body.qualification)
        }

        if(req.file)  updateData.image=req.file.filename;

        const student = await Student.findByIdAndUpdate(req.params.id,updateData,{
            new:true
        })
        res.json(student)
    } catch (error) {
         res.status(400).json({ message: error.message})
    }
})



/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Student ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       404:
 *         description: Student not found
 */

// router.delete("/:id", async (req, res) => {
//   try {
//     const student = await Student.findByIdAndDelete(req.params.id);

//     if (!student) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     // delete image file if exists
//     if (student.image) {
//       const filePath = path.join(__dirname, "uploads", student.image);
//       fs.existsSync(filePath) && fs.unlinkSync(filePath);
//     }

//     res.json({ message: "Student deleted successfully" });

//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });


module.exports=router;