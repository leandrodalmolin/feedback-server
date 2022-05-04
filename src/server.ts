import express from "express";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const app = express();
app.use(express.json());

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    }
});

app.post('/feedbacks', async (req, res) => {
    const { type, comment, screenshot } = req.body;

    const feedback = await prisma.feedback.create({
        data: {
            type,
            comment,
            screenshot
        }
    });

    await transport.sendMail({
        from: 'Team <hi@team.com>',
        to: 'Leandro <leandro.swk@hotmail.com>',
        subject: 'New Feedback',
        html: [
            `<div style="font-family: sans-serif; font-size: 16px; color: #111;">`,
            `<p><b>Feedback</b></p>`,
            `<p>Type: ${type}</p>`,
            `<p>Comment: ${comment}</p>`,
            `</div>`,
        ].join('\n')
    });
    
    return res.status(201).json({ data: feedback });
});

app.listen(3333, () => {
    console.log('HTTP server running.');
});