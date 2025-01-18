import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Button from "../Button";
import Input from "../Input";
import Icon from "../Icon";
import TripCard from "../TripCard";
import styles from "./PlanForm.module.css";

function PlanForm({ initialData, onSubmit, onCancel }) {
  const [plan, setPlan] = useState(initialData);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const trips = Array.from(plan.trips);
    const [reorderedTrip] = trips.splice(result.source.index, 1);
    trips.splice(result.destination.index, 0, reorderedTrip);

    setPlan({ ...plan, trips });
  };

  const handleNameChange = (e) => {
    setPlan({ ...plan, planName: e.target.value });
  };

  return (
    <div className={styles.form}>
      <Input
        label="方案名称"
        value={plan.planName}
        onChange={handleNameChange}
      />

      <div className={styles.tripList}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="trips">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={styles.list}
              >
                {plan.trips.map((trip, index) => (
                  <Draggable
                    key={index}
                    draggableId={`trip-${index}`}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={styles.tripWrapper}
                      >
                        <div className={styles.tripCard}>
                          <div
                            {...provided.dragHandleProps}
                            className={styles.dragHandle}
                          >
                            <Icon type="drag" />
                          </div>
                          <TripCard data={trip} />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className={styles.actions}>
        <Button onClick={onCancel}>取消</Button>
        <Button type="primary" onClick={() => onSubmit(plan)}>
          保存
        </Button>
      </div>
    </div>
  );
}

export default PlanForm;
