import { ValidationError } from '@nestjs/common';
import { toCapitalizeFirst, toTitleCase } from '@shared/utils';

export const extractErrorMessages = (
  error: ValidationError,
  parent?: ValidationError,
) => {
  let messages: any = [];
  if (error.constraints) {
    messages = Object.values(error.constraints).map((err) =>
      toCapitalizeFirst(
        err
          .replace(
            new RegExp(error.property, 'g'),
            toTitleCase(error.property) +
              (parent ? ` (in ${toTitleCase(parent.property)})` : ''),
          )
          .replace(/No /g, 'Number ')
          .replace(/a string/g, 'text')
          .replace(/should not be empty/g, 'is required')
          .replace(
            /.*must be a mongodb id/g,
            `Select a valid ${toTitleCase(error.property.replace(/id/i, ''))}`,
          ),
      ),
    );
  }
  if (error.children) {
    error.children.forEach((childError) => {
      messages = [...messages, ...extractErrorMessages(childError, error)];
    });
  }
  return messages;
};
