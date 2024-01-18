import { Request, Response } from 'express';
import Card from '../models/card';

export const getCards = (req: Request, res: Response) => Card.find({})
  .populate('owner')
  .then((cards) => res.status(200).send({ data: cards }))
  .catch((err) => res.status(500).send({ message: err.message }));

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

export const deleteCard = (req: Request, res: Response) => Card.findByIdAndDelete(req.params.cardId)
  .populate('owner')
  .then((card) => res.status(200).send({ data: card }))
  .catch((err) => res.status(500).send({ message: err.message }));

export const likeCard = (req: Request, res: Response) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .populate('owner')
  .then((card) => res.status(200).send({ data: card }))
  .catch((err) => res.status(500).send({ message: err.message }));

export const dislikeCard = (req: Request, res: Response) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .populate('owner')
  .then((card) => res.status(200).send({ data: card }))
  .catch((err) => res.status(500).send({ message: err.message }));
