<?php

declare(strict_types=1);

namespace App\Core;

class Validator
{
    private array $errors = [];

    public function validate(array $data, array $rules): bool
    {
        $this->errors = [];

        foreach ($rules as $field => $ruleString) {
            $fieldRules = explode('|', $ruleString);
            $value      = $data[$field] ?? null;

            foreach ($fieldRules as $rule) {
                if (str_contains($rule, ':')) {
                    [$ruleName, $param] = explode(':', $rule, 2);
                } else {
                    $ruleName = $rule;
                    $param    = null;
                }

                // Skip non-required rules on empty optional fields
                if ($ruleName !== 'required' && ($value === null || $value === '')) {
                    continue;
                }

                $this->applyRule($field, $ruleName, $value, $param);
            }
        }

        return empty($this->errors);
    }

    private function applyRule(string $field, string $rule, mixed $value, ?string $param): void
    {
        match ($rule) {
            'required' => $this->ruleRequired($field, $value),
            'email'    => $this->ruleEmail($field, $value),
            'min'      => $this->ruleMin($field, $value, (int) $param),
            'max'      => $this->ruleMax($field, $value, (int) $param),
            'in'       => $this->ruleIn($field, $value, explode(',', (string) $param)),
            'date'     => $this->ruleDate($field, $value),
            'numeric'  => $this->ruleNumeric($field, $value),
            'integer'  => $this->ruleInteger($field, $value),
            'string'   => $this->ruleString($field, $value),
            default    => null,
        };
    }

    private function ruleRequired(string $field, mixed $value): void
    {
        if ($value === null || $value === '' || (is_array($value) && empty($value))) {
            $this->addError($field, "Le champ « $field » est obligatoire.");
        }
    }

    private function ruleEmail(string $field, mixed $value): void
    {
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            $this->addError($field, "Le champ « $field » doit être une adresse e-mail valide.");
        }
    }

    private function ruleMin(string $field, mixed $value, int $min): void
    {
        if (mb_strlen((string) $value) < $min) {
            $this->addError($field, "Le champ « $field » doit contenir au moins $min caractères.");
        }
    }

    private function ruleMax(string $field, mixed $value, int $max): void
    {
        if (mb_strlen((string) $value) > $max) {
            $this->addError($field, "Le champ « $field » ne doit pas dépasser $max caractères.");
        }
    }

    private function ruleIn(string $field, mixed $value, array $allowed): void
    {
        if (!in_array($value, $allowed, true)) {
            $this->addError($field, "La valeur de « $field » est invalide. Valeurs autorisées : " . implode(', ', $allowed) . '.');
        }
    }

    private function ruleDate(string $field, mixed $value): void
    {
        $d = \DateTime::createFromFormat('Y-m-d', (string) $value);
        if (!$d || $d->format('Y-m-d') !== $value) {
            $this->addError($field, "Le champ « $field » doit être une date valide au format AAAA-MM-JJ.");
        }
    }

    private function ruleNumeric(string $field, mixed $value): void
    {
        if (!is_numeric($value)) {
            $this->addError($field, "Le champ « $field » doit être numérique.");
        }
    }

    private function ruleInteger(string $field, mixed $value): void
    {
        if (!filter_var($value, FILTER_VALIDATE_INT)) {
            $this->addError($field, "Le champ « $field » doit être un entier.");
        }
    }

    private function ruleString(string $field, mixed $value): void
    {
        if (!is_string($value)) {
            $this->addError($field, "Le champ « $field » doit être une chaîne de caractères.");
        }
    }

    private function addError(string $field, string $message): void
    {
        $this->errors[$field][] = $message;
    }

    public function getErrors(): array
    {
        return $this->errors;
    }
}
