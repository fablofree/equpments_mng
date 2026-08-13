<?php

declare(strict_types=1);

namespace App\Core;

abstract class Controller
{
    // Base controller — provides access to Response and Validator for subclasses.

    protected function validate(array $data, array $rules): void
    {
        $validator = new Validator();
        if (!$validator->validate($data, $rules)) {
            Response::validationError($validator->getErrors());
        }
    }
}
