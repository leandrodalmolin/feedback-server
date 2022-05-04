import { MailAdapter } from "../adapters/mail-adapter";
import { FeedbacksRepository } from "../repositories/feedbacks-repository";

interface SubmitFeedbackUseCaseRequest {
    type: string;
    comment: string;
    screenshot?: string;
}

export class SubmitFeedbackUseCase {
    private feedbacksRepository: FeedbacksRepository;
    private mailAdapter: MailAdapter;

    constructor(feedbacksRepository: FeedbacksRepository, mailAdapter: MailAdapter) {
        this.feedbacksRepository = feedbacksRepository;
        this.mailAdapter = mailAdapter;
    }

    async execute(request: SubmitFeedbackUseCaseRequest) {
        const { type, comment, screenshot } = request;

        await this.feedbacksRepository.create({
            type,
            comment,
            screenshot,
        });

        await this.mailAdapter.sendMail({
            subject: 'New Feedback',
            body: [
                `<div style="font-family: sans-serif; font-size: 16px; color: #111;">`,
                `<p><b>Feedback</b></p>`,
                `<p>Type: ${type}</p>`,
                `<p>Comment: ${comment}</p>`,
                `</div>`,
            ].join('\n')
        })
    }
}