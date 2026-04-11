import {GigMapper} from "@/app/mapper/gig.mapper.js";
import {GigDtoMapper} from "@/app/mapper/gig.dto.mapper.js";
import {GigRepository} from "@/infrastructure/repositories/gig.repository.js";
import {CreateGigUseCase} from "@/app/use-case/gigService/createGig.usecase.js";
import {GigController} from "@/app/controllers/gig.controller.js";

const gigMapper = new GigMapper();
const gigDtoMapper = new GigDtoMapper();
const gigRepository = new GigRepository(gigMapper);
const createGigUseCase = new CreateGigUseCase(gigRepository);

export const gigController = new GigController(createGigUseCase, gigDtoMapper);